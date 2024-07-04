import {
  BaseConnector,
  ConnectionError,
  CompiledQuery,
  ResolvedParam,
  ConnectorOptions,
} from '@latitude-data/source-manager'
import { readFileSync } from 'fs'
import pkg, { Pool, RowDataPacket } from 'mysql2/promise'
import QueryResult, { DataType, Field } from '@latitude-data/query_result'

const { Types, createPool } = pkg

export type SSLConfig = {
  ca?: string
  key?: string
  cert?: string
  rejectUnauthorized?: boolean
}

type SSLOptions = boolean | 'Amazon RDS' | SSLConfig

export type ConnectionParams = {
  host: string
  user: string
  password: string
  database: string
  port?: number
  ssl?: SSLOptions
}

export default class MysqlConnector extends BaseConnector<ConnectionParams> {
  private pool: Pool

  constructor(options: ConnectorOptions<ConnectionParams>) {
    super(options)
    this.pool = createPool({
      connectionLimit: 10,
      ...this.buildConnectionParams(options.connectionParams),
    })
  }

  async end(): Promise<void> {
    this.pool.end()
  }

  resolve(value: unknown, _: number): ResolvedParam {
    return {
      value,
      resolvedAs: '?',
    }
  }

  async runQuery(query: CompiledQuery): Promise<QueryResult> {
    if (!this.pool) {
      throw new ConnectionError('Connection not established')
    }

    try {
      const conn = await this.pool.getConnection()
      const [rows, fields] = await conn.execute<RowDataPacket[][]>(
        query.sql,
        this.buildQueryParams(query.resolvedParams),
      )

      conn.release()

      if (!rows) return new QueryResult({})

      return new QueryResult({
        rowCount: rows.length,
        fields: (fields ?? [])?.map(
          (field) =>
            ({
              name: field.name,
              type: this.convertDataType(field.type),
            }) as Field,
        ),
        rows: rows.map((row: RowDataPacket[]) =>
          row ? Object.values(row) : [],
        ),
      })
    } catch (error) {
      throw new ConnectionError((error as Error).message)
    }
  }

  private buildConnectionParams(params: ConnectionParams) {
    const payload = {
      host: params.host,
      port: params.port,
      user: params.user,
      password: params.password,
      database: params.database,
      ssl:
        params.ssl !== undefined ? this.buildSSLConfig(params.ssl) : undefined,
    }

    return this.compact(payload)
  }

  private buildSSLConfig(ssl: SSLOptions) {
    if (ssl === 'Amazon RDS') return 'Amazon RDS'
    if (typeof ssl === 'boolean') {
      if (ssl) return {}
      else return undefined
    }

    const { ca, key, cert, rejectUnauthorized } = ssl
    const payload = {
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

  private buildQueryParams(params: ResolvedParam[]) {
    return params.map((param) => param.value)
  }

  private convertDataType(
    dataTypeID: number | undefined,
    fallbackType = DataType.Unknown,
  ) {
    switch (dataTypeID) {
      case Types.VARCHAR:
      case Types.VAR_STRING:
      case Types.STRING:
        return DataType.String
      case Types.TINY:
      case Types.SHORT:
      case Types.LONG:
      case Types.INT24:
        return DataType.Integer
      case Types.DECIMAL:
      case Types.FLOAT:
      case Types.DOUBLE:
      case Types.NEWDECIMAL:
        return DataType.Float
      case Types.TIME:
      case Types.DATETIME:
      case Types.YEAR:
      case Types.NEWDATE:
      case Types.TIMESTAMP:
        return DataType.Datetime
      case Types.BLOB:
      case Types.TINY_BLOB:
      case Types.MEDIUM_BLOB:
      case Types.LONG_BLOB:
      case Types.ENUM:
      case Types.JSON:
      case Types.SET:
      case Types.NULL:
      case Types.GEOMETRY:
      case Types.BIT:
        return fallbackType
    }
  }
}
