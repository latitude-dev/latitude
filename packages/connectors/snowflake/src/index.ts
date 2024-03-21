import {
  BaseConnector,
  ConnectionError,
  CompiledQuery,
  ResolvedParam,
  ConnectorError,
} from '@latitude-data/base-connector'
import QueryResult, { DataType } from '@latitude-data/query_result'
import pkg from 'snowflake-sdk'

const { createPool } = pkg

export type ConnectionParams = {
  account: string
  username?: string
  password?: string
  token?: string
  privateKey?: string
  privateKeyPath?: string
  privateKeyPass?: string
}

export class SnowflakeConnector extends BaseConnector {
  private pool

  constructor(rootPath: string, connectionParams: ConnectionParams) {
    super(rootPath)

    this.pool = createPool(this.buildConnectionParams(connectionParams), {
      max: 10,
      min: 0,
    })
  }

  resolve(value: unknown, index: number): ResolvedParam {
    return {
      value,
      resolvedAs: `$${index + 1}`,
    }
  }

  runQuery(query: CompiledQuery): Promise<QueryResult> {
    return new Promise((resolve, reject) => {
      this.pool.use(async (connection) => {
        connection.execute({
          sqlText: query.sql,
          binds: this.buildQueryParams(query.params),
          streamResult: true,
          complete: (err, stmt) => {
            if (err) {
              return reject(new ConnectorError(err.message))
            }

            const stream = stmt.streamRows()
            const fields = stmt.getColumns().map((field) => ({
              name: field.getName(),
              type: this.convertDataType(field.getType()),
            }))

            const result = new QueryResult({
              fields,
              rowCount: stmt.getNumRows(),
            })

            stream.on('error', (err) => {
              reject(new ConnectorError(err.message))
            })

            stream.on('data', (row) => {
              result.rows.push(Object.values(row))
            })

            stream.on('end', () => {
              resolve(result)
            })
          },
        })
      })
    })
  }

  private buildConnectionParams(params: ConnectionParams) {
    if (params.username) {
      return {
        account: params.account,
        username: params.username,
        password: params.password,
      }
    } else if (params.token) {
      return {
        account: params.account,
        token: params.token,
      }
    } else if (params.privateKey) {
      return {
        account: params.account,
        privateKey: params.privateKey,
      }
    } else if (params.privateKeyPath) {
      return {
        account: params.account,
        privateKeyPath: params.privateKeyPath,
        privateKeyPass: params.privateKeyPass,
      }
    } else {
      throw new ConnectionError('No valid credentials provided')
    }
  }

  private buildQueryParams(params: ResolvedParam[]) {
    return params.map((param) => param.value) as pkg.Bind[]
  }

  private convertDataType(
    dataTypeID: string,
    fallbackType = DataType.Unknown,
  ): DataType {
    switch (dataTypeID) {
      case 'boolean':
        return DataType.Boolean
      case 'int':
      case 'integer':
      case 'bigint':
      case 'smallint':
        return DataType.Integer
      case 'number':
      case 'numeric':
      case 'decimal':
      case 'float':
      case 'float4':
      case 'float8':
      case 'double':
      case 'double precision':
      case 'real':
      case 'fixed':
        return DataType.Float
      case 'text':
        return DataType.String
      case 'date':
      case 'time':
      case 'timestamp':
      case 'timestamp_ltz':
      case 'timestamp_ntz':
      case 'timestamp_tz':
        return DataType.Datetime
      case 'variant':
      case 'array':
      case 'object':
      default:
        return fallbackType
    }
  }
}
