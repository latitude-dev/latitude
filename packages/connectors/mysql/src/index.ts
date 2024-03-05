import {
  BaseConnector,
  ConnectionError,
  CompiledQuery,
  ResolvedParam,
  QueryError,
} from '@latitude-data/base-connector'
import QueryResult, { DataType, Field } from '@latitude-data/query_result'
import { PoolConfig, Types, createPool } from 'mysql'
import fs from 'fs'

export type ConnectionParams = {
  host: string
  user: string
  password: string
  database: string
  ssl?: {
    ca: string
  }
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
                rows: results,
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
    } as Partial<PoolConfig>

    if (params.ssl) {
      payload.ssl = { ca: fs.readFileSync(params.ssl.ca) }
    }

    return payload
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
