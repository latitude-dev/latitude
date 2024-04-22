import {
  BaseConnector,
  ConnectionError,
  QueryError,
  CompiledQuery,
  ResolvedParam,
} from '@latitude-data/base-connector'
import QueryResult, { DataType } from '@latitude-data/query_result'
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

export default class PostgresConnector extends BaseConnector {
  private pool: pg.Pool

  constructor(rootPath: string, connectionParams: ConnectionParams) {
    super(rootPath)
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

  async runQuery(request: CompiledQuery): Promise<QueryResult> {
    const client = await this.createClient()

    try {
      const result = await client.query({
        text: request.sql,
        values: request.params.map((param) => param.value),
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

      case pgtypes.builtins.NUMERIC:
      case pgtypes.builtins.MONEY:
      case pgtypes.builtins.INT2:
      case pgtypes.builtins.INT4:
      case pgtypes.builtins.INT8:
        return DataType.Integer

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
