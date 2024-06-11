import SourceManager from '@/manager'
import { ParquetLogicalType, QueryConfig, QueryRequest } from '@/types'
import { DataType, Field } from '@latitude-data/query_result'
import { createHash } from 'crypto'

import { ParquetWriter, ParquetSchema } from '@dsnp/parquetjs'
import { FieldDefinition, ParquetType } from '@dsnp/parquetjs/dist/lib/declare'
import { Source } from '@/source'

const ROW_GROUP_SIZE = 4096 // How many rows are in the ParquetWriter file buffer at a time

function mapDataTypeToParquet(dataType: DataType): ParquetType {
  switch (dataType) {
    case DataType.Boolean:
      return ParquetLogicalType.BOOLEAN

    case DataType.Datetime:
      return ParquetLogicalType.TIMESTAMP_MICROS

    case DataType.Integer:
      // TODO: review this decision. I faced an issue with an int8 column
      // in postgresql which is a BigInt. This library does not support it.
      // it breaks saying:
      //   Cannot convert a BigInt value to a number 💥
      // If we put here INT64 it works but not sure is the best approach.
      return ParquetLogicalType.INT32

    case DataType.Float:
      return ParquetLogicalType.FLOAT

    case DataType.String:
      return ParquetLogicalType.UTF8

    default:
      return ParquetLogicalType.BYTE_ARRAY
  }
}

export type MaterializeProps = Omit<QueryRequest, 'params'> & {
  batchSize?: number
  onDebug?: (_p: { memoryUsageInMb: string }) => void
}

type Result = { fileSize: number; rows: number }

export abstract class StorageDriver {
  private manager: SourceManager

  constructor({ manager }: { manager: SourceManager }) {
    this.manager = manager
  }

  protected abstract resolveUrl(localFilepath: string): Promise<string>
  protected abstract exists(localFilepath: string): Promise<boolean>
  protected abstract parquetFileTime(localFilepath: string): Promise<number>
  protected abstract parquetFileSize(localFilepath: string): Promise<number>

  async getParquetFilepath(queryPath: string): Promise<string> {
    const { localFilepath } = await this.read(queryPath)
    return this.resolveUrl(localFilepath)
  }

  async isMaterialized(queryPath: string): Promise<boolean> {
    const { queryConfig, localFilepath } = await this.read(queryPath)
    if (!(await this.exists(localFilepath))) return false

    const { ttl } = queryConfig
    const maxLifeTime = ((ttl as number) ?? 0) * 1000 // ttl is in seconds
    const lifeTime = Date.now() - (await this.parquetFileTime(localFilepath)) // In milliseconds
    return lifeTime < maxLifeTime
  }

  async materialize({
    queryPath,
    batchSize,
    onDebug,
  }: MaterializeProps): Promise<Result> {
    const { source, queryConfig, localFilepath } = await this.read(queryPath)

    if (!queryConfig.materialize) {
      throw new Error('Query is not configured as materialized')
    }

    const globalFilepath = await this.getParquetFilepath(queryPath)
    const compiled = await source.compileQuery({ queryPath, params: {} })

    let writer: ParquetWriter
    let currentHeap = 0
    return new Promise<Result>((resolve, reject) => {
      let rows = 0

      const size = batchSize ?? 1000
      source
        .batchQuery(compiled, {
          batchSize: size,
          onBatch: async (batch) => {
            if (!writer) {
              const schema = this.buildParquetSchema(batch.fields)
              writer = await ParquetWriter.openFile(schema, globalFilepath, {
                rowGroupSize: size > ROW_GROUP_SIZE ? size : ROW_GROUP_SIZE,
              })
            }

            for (const row of batch.rows) {
              if (onDebug) {
                let heapUsed = process.memoryUsage().heapUsed

                if (heapUsed < currentHeap) {
                  onDebug({
                    memoryUsageInMb: `${(currentHeap / 1024 / 1024).toFixed(
                      2,
                    )} MB`,
                  })
                }

                currentHeap = heapUsed
              }

              try {
                await writer.appendRow(row)
              } catch {
                // If for some reason a row writing fails we don't want
                // to break the process.
              }
            }
            rows += batch.rows.length

            if (batch.lastBatch) {
              await writer.close()
              const fileSize = await this.parquetFileSize(localFilepath)
              resolve({ fileSize, rows })
            }
          },
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  private async read(queryPath: string): Promise<{
    source: Source
    queryConfig: QueryConfig
    localFilepath: string
  }> {
    const source = await this.manager.loadFromQuery(queryPath)
    const { config, sqlHash } = await source.getMetadataFromQuery(queryPath)

    const uniqueHash = createHash('sha256')
      .update(sqlHash!)
      .update(source.path)
      .digest('hex')
    const localFilepath = `${uniqueHash}.parquet`

    return { source, queryConfig: config, localFilepath }
  }

  private buildParquetSchema(fields: Field[]) {
    const columns = fields.reduce(
      (schema, field) => {
        const type = mapDataTypeToParquet(field.type)
        schema[field.name] = {
          type,
          optional: true,
          compression: 'SNAPPY',
        }
        return schema
      },
      {} as { [key: string]: FieldDefinition },
    )

    return new ParquetSchema(columns)
  }
}
