import 'dotenv/config'
import * as fs from 'fs'
import path from 'path'
import findSourceConfigFromQuery from './findSourceConfig'
import {
  MaterializationInfo,
  QueryConfig,
  QueryNotFoundError,
  SourceFileNotFoundError,
} from '@/types'
import { Source } from '@/source'
import readSourceConfig from '@/source/readConfig'
import {
  FileStat,
  getStorageDriver,
  StorageDriver,
} from '@latitude-data/storage-driver'
import { createHash } from 'crypto'
import { ParquetWriter } from '@dsnp/parquetjs'
import { WriteStreamMinimal } from '@dsnp/parquetjs/dist/lib/util'
import { buildParquetSchema } from './parquetUtils'
import { Writable } from 'stream'

const MATERIALIZED_DIR_IN_STORAGE = 'materialized'

export default class SourceManager {
  private instances: Record<string, Source> = {}
  readonly materializedStorage: StorageDriver
  readonly queriesDir: string

  constructor(
    queriesDir: string,
    options: {
      storage?: StorageDriver
    } = {},
  ) {
    this.queriesDir = queriesDir
    this.materializedStorage =
      options.storage ?? getStorageDriver({ type: 'disk' })
  }

  /**
   * Finds the source configuration file in the given path and loads it
   * @param path - The path to any file in the source directory.
   * This could be the source configuration file itself or any other query in the directory.
   */
  async loadFromQuery(query: string): Promise<Source> {
    const filePath = path.join(
      this.queriesDir,
      query.endsWith('.sql') ? query : `${query}.sql`,
    )

    if (!filePath.includes(this.queriesDir)) {
      throw new SourceFileNotFoundError(
        `Query file is not in the queries directory: ${filePath}`,
      )
    }

    if (!fs.existsSync(filePath)) {
      throw new QueryNotFoundError(`Query file not found at ${filePath}`)
    }

    const sourceFilePath = findSourceConfigFromQuery({
      query,
      queriesDir: this.queriesDir,
    })

    const sourcePath = path.relative(
      this.queriesDir,
      path.dirname(sourceFilePath),
    )

    if (!this.instances[sourcePath]) {
      this.buildSource({ sourcePath, sourceFile: sourceFilePath })
    }

    return this.instances[sourcePath]!
  }

  /**
   * Loads a source from a source configuration file
   * @param sourceFile - The path to the source configuration file
   */
  async loadFromConfigFile(sourceFile: string): Promise<Source> {
    if (!path.isAbsolute(sourceFile)) {
      sourceFile = path.join(this.queriesDir, sourceFile)
    }

    if (!fs.existsSync(sourceFile)) {
      throw new SourceFileNotFoundError(
        `Source file not found at ${sourceFile}`,
      )
    }

    // If the given path is not in queriesDir, throw an error
    if (!sourceFile.includes(this.queriesDir)) {
      throw new SourceFileNotFoundError(
        `Source file is not in the queries directory: ${sourceFile}`,
      )
    }

    const sourcePath = path.relative(this.queriesDir, path.dirname(sourceFile))
    if (!this.instances[sourcePath]) {
      this.buildSource({ sourcePath, sourceFile })
    }

    return this.instances[sourcePath]!
  }

  /**
   * Safely closes the connection to a source and removes the instance from the cache
   */
  async clear(source: Source): Promise<void> {
    await source.endConnection()
    delete this.instances[source.path]
  }

  /**
   * Clears all sources and closes all connections
   */
  async clearAll(): Promise<void> {
    await Promise.all(
      Object.values(this.instances).map((source) => this.clear(source)),
    )
  }

  private buildSource({
    sourceFile,
    sourcePath,
  }: {
    sourceFile: string
    sourcePath: string
  }) {
    const schema = readSourceConfig(sourceFile)
    this.instances[sourcePath] = new Source({
      path: sourcePath,
      schema,
      sourceManager: this,
    })
  }

  async localMaterializationPath(queryPath: string): Promise<string> {
    const source = await this.loadFromQuery(queryPath)
    const { sqlHash } = await source.getMetadataFromQuery(queryPath)

    const uniqueHash = createHash('sha256')
      .update(sqlHash!)
      .update(source.path)
      .digest('hex')
    return `${MATERIALIZED_DIR_IN_STORAGE}/${uniqueHash}.parquet`
  }

  async materializationUrl(queryPath: string): Promise<string> {
    const path = await this.localMaterializationPath(queryPath)
    return this.materializedStorage.resolveUrl(path)
  }

  private async isMaterializationValid(
    config: QueryConfig,
    parquetFilepath: string,
  ): Promise<boolean> {
    const fileExists = await this.materializedStorage.exists(parquetFilepath)
    if (!fileExists) return false
    if (config.ttl === undefined) return true // No TTL means always valid
    const parquetCreationTime = await this.materializedStorage
      .stat(parquetFilepath)
      .then((stat: FileStat) => stat.mtimeMs)
    const currentTime = Date.now()
    const parquetLifetimeMs = currentTime - parquetCreationTime
    const ttlMs = config.ttl * 1000

    return parquetLifetimeMs < ttlMs
  }

  async materializeQuery({
    queryPath,
    force,
    batchSize = 4096,
  }: {
    queryPath: string
    force?: boolean
    batchSize?: number
  }): Promise<MaterializationInfo> {
    try {
      const source = await this.loadFromQuery(queryPath)
      const { config } = await source.getMetadataFromQuery(queryPath)
      const filename = await this.localMaterializationPath(queryPath)
      const url = await this.materializedStorage.resolveUrl(filename)

      if (!config.materialize) {
        throw new Error('Materialization is not enabled for this query')
      }

      if (!force && (await this.isMaterializationValid(config, filename))) {
        return {
          queryPath,
          cached: true,
          url,
        }
      }

      const startTime = performance.now()
      const compiled = await source.compileQuery({ queryPath, params: {} })

      const stream = (await this.materializedStorage.createWriteStream(
        filename,
      )) as Writable

      let writer: ParquetWriter
      const ROW_GROUP_SIZE = 4096 // How many rows are in the ParquetWriter file buffer at a time
      let rows = 0
      await new Promise<void>((resolve, reject) => {
        stream.on('error', (error) => {
          reject(error)
        })
        source
          .batchQuery(compiled, {
            batchSize: batchSize,
            onBatch: async (batch) => {
              if (!writer) {
                const schema = buildParquetSchema(batch.fields)
                writer = await ParquetWriter.openStream(
                  schema,
                  stream as unknown as WriteStreamMinimal,
                  { rowGroupSize: Math.max(batchSize, ROW_GROUP_SIZE) },
                )
              }

              for (const row of batch.rows) {
                await writer.appendRow(row)
              }
              rows += batch.rows.length

              if (batch.lastBatch) {
                writer.close()
                await new Promise((r) => stream.on('close', r))
                resolve()
              }
            },
          })
          .catch(reject)
      })

      const endTime = performance.now()

      const fileSize = await this.materializedStorage
        .stat(filename)
        .then((stat: FileStat) => stat.size)

      return {
        queryPath,
        cached: false,
        success: true,
        url,
        fileSize,
        rows,
        time: endTime - startTime,
      }
    } catch (error) {
      return {
        queryPath,
        cached: false,
        success: false,
        error: error as Error,
      }
    }
  }
}
