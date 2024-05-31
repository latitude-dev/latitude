import SourceManager from '@/manager'
import { ParquetLogicalType, QueryRequest } from '@/types'
import { DataType, Field } from '@latitude-data/query_result'
import { createHash } from 'crypto'

import { ParquetWriter, ParquetSchema } from '@dsnp/parquetjs'
import { FieldDefinition, ParquetType } from '@dsnp/parquetjs/dist/lib/declare'

export type GetUrlParams = {
  sqlHash: string
  queryName: string
  sourcePath: string
  ignoreMissingFile?: boolean
}
export type ResolveUrlParams = GetUrlParams & {
  filename: string
  ignoreMissingFile?: boolean
}
export class MaterializedFileNotFoundError extends Error {}

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

const ROW_GROUP_SIZE = 4096 // PARQUET BATCH WRITE
type Result = { filePath: string; queryRows: number }
export type WriteParquetParams = QueryRequest & {
  batchSize?: number
  onDebug?: (_p: { memoryUsageInMb: string }) => void
}

/**
 * In order to hash a SQL query, we need to know the source path
 * it came from. This way we ensure the path is unique even
 * if two sources share the same query.
 */
export abstract class StorageDriver {
  private manager: SourceManager

  constructor({ manager }: { manager: SourceManager }) {
    this.manager = manager
  }

  abstract get basePath(): string

  async writeParquet({
    queryPath,
    params,
    batchSize,
    onDebug,
  }: WriteParquetParams) {
    let writer: ParquetWriter
    const source = await this.manager.loadFromQuery(queryPath)
    const { config, sqlHash } = await source.getMetadataFromQuery(queryPath)

    if (!config.materialize) {
      throw new Error('Query is not configured as materialized')
    }

    const compiled = await source.compileQuery({ queryPath, params })

    let currentHeap = 0
    return new Promise<Result>((resolve) => {
      let filePath: string
      let queryRows = 0

      const size = batchSize ?? 1000
      source.batchQuery(compiled, {
        batchSize: size,
        onBatch: async (batch) => {
          if (!writer) {
            const schema = this.buildParquetSchema(batch.fields)
            filePath = await this.getUrl({
              sqlHash: sqlHash!,
              queryName: queryPath,
              sourcePath: source.path,
              ignoreMissingFile: true,
            })

            writer = await ParquetWriter.openFile(schema, filePath, {
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
          queryRows += batch.rows.length

          if (batch.lastBatch) {
            await writer.close()
            resolve({ filePath, queryRows })
          }
        },
      })
    })
  }

  getUrl(args: GetUrlParams): Promise<string> {
    const name = StorageDriver.hashName(args)
    const filename = `${name}.parquet`

    return this.resolveUrl({ ...args, filename })
  }

  /**
   * It's a Promise because other adapters can be async
   */
  abstract resolveUrl({ filename }: ResolveUrlParams): Promise<string>

  static hashName({ sqlHash, sourcePath }: GetUrlParams) {
    const hash = createHash('sha256')
    hash.update(sqlHash)
    hash.update(sourcePath)
    return hash.digest('hex')
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
