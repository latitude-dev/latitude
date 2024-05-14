import 'dotenv/config'
import * as fs from 'fs'
import path from 'path'
import findSourceConfigFromQuery from './findSourceConfig'
import { QueryNotFoundError, SourceFileNotFoundError } from '@/types'
import { Source } from '@/source'
import readSourceConfig from '@/source/readConfig'
import { StorageDriver } from '@/materialize/drivers/StorageDriver'
import DummyDriver from '@/materialize/drivers/dummy/DummyDriver'
import { DriverConfig, StorageKlass, StorageType } from '@/materialize'

export default class SourceManager {
  private instances: Record<string, Source> = {}
  readonly materializeStorage: StorageDriver
  readonly queriesDir: string

  constructor(
    queriesDir: string,
    options: {
      materialize?: {
        Klass: StorageKlass
        config: DriverConfig<StorageType>
      }
    } = {},
  ) {
    this.queriesDir = queriesDir
    const materializeKlass = options.materialize?.Klass ?? DummyDriver
    const commonConfig = { manager: this }
    const config = options.materialize?.config
    this.materializeStorage = config
      ? new materializeKlass({ ...config, ...commonConfig })
      : new DummyDriver(commonConfig)
  }

  /**
   * Finds the source configuration file in the given path and loads it
   * @param path - The path to any file in the source directory. This could be the source configuration file itself or any other query in the directory.
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

    const sourcePath = path.dirname(sourceFile)
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
}
