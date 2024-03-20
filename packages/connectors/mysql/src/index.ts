import {
  BaseConnector,
  ConnectionError,
  CompiledQuery,
  ResolvedParam,
  QueryError,
} from '@latitude-data/base-connector'
import { readFileSync } from 'fs'
import { PoolConfig, Types, createPool } from 'mysql'
import QueryResult, { DataType, Field } from '@latitude-data/query_result'

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
  ssl?: SSLOptions
}

export class MysqlConnector extends BaseConnector {
  private pool

  constructor(rootPath: string, connectionParams: ConnectionParams) {
    super(rootPath)

    this.pool = createPool({
      connectionLimit: 10,
      ...this.buildConnectionParams(connectionParams),
    })
  }

  resolve(value: unknown, _: number): ResolvedParam {
    return {
      value,
      resolvedAs: '?',
    }
  }

  runQuery(query: CompiledQuery): Promise<QueryResult> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          return reject(new ConnectionError(err.message))
        }

        connection.query(
          query.sql,
          this.buildQueryParams(query.params),
          (error, results, fields) => {
            connection.release()

            if (error) {
              return reject(new QueryError(error.message))
            }

            resolve(
              new QueryResult({
                rowCount: results.length,
                fields: (fields ?? [])?.map(
                  (field) =>
                    ({
                      name: field.name,
                      type: this.convertDataType(field.type),
                    }) as Field,
                ),
                rows: results.map((row: Record<string, unknown>) =>
                  row ? Object.values(row) : [],
                ),
              }),
            )
          },
        )
      })
    })
  }

  private buildConnectionParams(params: ConnectionParams) {
    const payload = {
      host: params.host,
      user: params.user,
      password: params.password,
      database: params.database,
      ssl:
        params.ssl !== undefined ? this.buildSSLConfig(params.ssl) : undefined,
    } as Partial<PoolConfig>

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

  private convertDataType(dataTypeID: Types, fallbackType = DataType.Unknown) {
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
      case Types.TIME2:
      case Types.TIMESTAMP2:
      case Types.DATETIME:
      case Types.DATETIME2:
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
