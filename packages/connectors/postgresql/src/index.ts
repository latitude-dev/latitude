import Cursor from 'pg-cursor'
import {
  BaseConnector,
  ConnectionError,
  QueryError,
  CompiledQuery,
  ResolvedParam,
  ConnectorOptions,
  BatchedRow,
  BatchedQueryOptions,
  BatchResponse,
} from '@latitude-data/source-manager'
import QueryResult, { DataType, Field } from '@latitude-data/query_result'
import pg from 'pg'
import { readFileSync } from 'fs'

const { Pool, types: pgtypes } = pg

type SSLConfig = {
  sslmode?: 'allow' | 'prefer' | 'require' | 'verify-ca' | 'verify-full'
  ca?: string
  key?: string
  cert?: string
  rejectUnauthorized?: boolean
}

export type ConnectionParams = {
  database: string
  user: string
  password: string
  host: string
  port: number
  schema?: string
  ssl?: boolean | SSLConfig
}

export default class PostgresConnector extends BaseConnector<ConnectionParams> {
  private pool: pg.Pool

  constructor(options: ConnectorOptions<ConnectionParams>) {
    super(options)
    const connectionParams = options.connectionParams
    this.pool = new Pool(this.buildConnectionParams(connectionParams))

    if (connectionParams.schema) {
      this.pool.on('connect', (client) => {
        client.query(`SET search_path TO ${connectionParams.schema}`)
      })
    }
  }

  end(): Promise<void> {
    return this.pool.end()
  }

  resolve(value: unknown, index: number): ResolvedParam {
    /**
     * The pg library parameterises variables as $i where i is an increasing number starting
     * from 1, for regular variables, and $i::text for strings.
     */
    const isText = typeof value === 'string'
    const suffix = isText ? '::text' : ''
    return {
      value,
      resolvedAs: `$${index + 1}${suffix}`,
    }
  }

  async runQuery(compiledQuery: CompiledQuery): Promise<QueryResult> {
    const client = await this.createClient()

    try {
      const result = await client.query({
        text: compiledQuery.sql,
        values: compiledQuery.resolvedParams.map((param) => param.value),
      })

      return new QueryResult({
        rowCount: result.rowCount || 0,
        fields: result.fields.map((field) => ({
          name: field.name,
          type: this.convertDataType(field.dataTypeID),
        })),
        rows: result.rows.map((row) => Object.values(row)),
      })
    } catch (error) {
      const errorObj = error as pg.DatabaseError
      throw new QueryError(errorObj.message, errorObj)
    } finally {
      client.release()
    }
  }

  async batchQuery(
    compiledQuery: CompiledQuery,
    { batchSize, onBatch }: BatchedQueryOptions,
  ): Promise<void> {
    const client = await this.createClient()
    const cursor = client.query(
      new Cursor(
        compiledQuery.sql,
        compiledQuery.resolvedParams.map((param) => param.value),
      ),
    )
    let fields: Field[] = []
    try {
      const readRows = (rowsByBatch: number) => {
        return new Promise<BatchResponse>((resolve, reject) => {
          cursor.read(
            rowsByBatch,
            (err, rows: BatchedRow[], result: pg.QueryResult) => {
              if (err) {
                return reject(err)
              }

              if (!fields.length) {
                for (let i = 0; i < result.fields.length; i++) {
                  fields.push({
                    name: result.fields[i]!.name,
                    type: this.convertDataType(
                      result.fields[i]!.dataTypeID!,
                      DataType.Unknown,
                    ),
                  })
                }
              }

              resolve({ rows, fields, lastBatch: rows.length === 0 })
            },
          )
        })
      }

      let response: BatchResponse

      do {
        response = await readRows(batchSize)

        await onBatch(response)
      } while (response.rows.length > 0)
    } catch (error) {
      client.release()
      const errorObj = error as pg.DatabaseError
      console.error('Error in batch query', errorObj)
      throw new QueryError(errorObj.message, errorObj)
    } finally {
      cursor.close(() => {
        client.release()
      })
    }
  }

  private async createClient() {
    try {
      return await this.pool.connect()
    } catch (error: unknown) {
      const errorObj = error as Error
      throw new ConnectionError(errorObj.message, errorObj)
    }
  }

  private convertDataType(
    dataTypeID: number,
    fallbackType = DataType.Unknown,
  ): DataType {
    switch (dataTypeID) {
      case pgtypes.builtins.BOOL:
        return DataType.Boolean

      case pgtypes.builtins.MONEY:
      case pgtypes.builtins.INT2:
      case pgtypes.builtins.INT4:
      case pgtypes.builtins.INT8:
        return DataType.Integer

      case pgtypes.builtins.NUMERIC:
      case pgtypes.builtins.FLOAT4:
      case pgtypes.builtins.FLOAT8:
        return DataType.Float

      case pgtypes.builtins.VARCHAR:
      case pgtypes.builtins.TEXT:
      case pgtypes.builtins.CHAR:
      case pgtypes.builtins.JSON:
      case pgtypes.builtins.XML:
        return DataType.String

      case pgtypes.builtins.DATE:
      case pgtypes.builtins.TIME:
      case pgtypes.builtins.TIMETZ:
      case pgtypes.builtins.TIMESTAMP:
      case pgtypes.builtins.TIMESTAMPTZ:
        return DataType.Datetime

      default:
        return fallbackType
    }
  }

  private buildConnectionParams(params: ConnectionParams): ConnectionParams {
    const payload = {
      ...params,
      ssl:
        params.ssl !== undefined ? this.buildSSLConfig(params.ssl) : undefined,
    }

    return this.compact(payload) as ConnectionParams
  }

  private buildSSLConfig(ssl: boolean | SSLConfig) {
    if (typeof ssl === 'boolean') {
      return ssl
    }

    const { sslmode, ca, key, cert, rejectUnauthorized } = ssl
    const payload = {
      sslmode,
      rejectUnauthorized,
      ca: ca ? this.readSecureFile(ca) : undefined,
      key: key ? this.readSecureFile(key) : undefined,
      cert: cert ? this.readSecureFile(cert) : undefined,
    }

    return this.compact(payload)
  }

  private readSecureFile(filePath: string) {
    try {
      return readFileSync(filePath).toString()
    } catch (error) {
      throw new Error(
        `Failed to read file at ${filePath}: ${(error as Error).message}`,
      )
    }
  }

  private compact(obj: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(obj).filter(([, value]) => value !== undefined),
    )
  }
}
