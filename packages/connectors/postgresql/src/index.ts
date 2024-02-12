import { BaseConnector, BaseAdapter, QueryParams, QueryRequest, QueryResult, DataType, ConnectionError, QueryError } from '@latitude-dev/base-connector'
import { Pool, types, DatabaseError } from 'pg'

export type ConnectionParams = {
  database: string
  user: string
  password: string
  host: string
  port: number
  schema?: string
}
class PostgresAdapter extends BaseAdapter {
  private params: { varName: string, value: unknown }[] = []

  constructor() {
    super()
  }

  resolve(varName: string, value: unknown): string {
    let index = this.params.findIndex(param => param.varName === varName)
    if (index === -1) {
      this.params.push({
        varName,
        value,
      })
      index = this.params.length - 1
    }

    const isText = typeof value === 'string'
    return `$${index + 1}${isText ? '::text' : ''}`
  }

  getParams(): QueryParams {
    return this.params.reduce((acc, param, index) => {
      acc[index] = param.value
      return acc
    }, {} as QueryParams)
  }
}

export class PostgresConnector extends BaseConnector {
  private pool: Pool

  constructor(connectionParams: ConnectionParams) {
    super()
    this.pool = new Pool(connectionParams)
    if (connectionParams.schema) {
      this.pool.on('connect', client => {
        client.query(`SET search_path TO ${connectionParams.schema}`)
      })
    }
  }

  adapter(): BaseAdapter {
    return new PostgresAdapter()
  }

  async runQuery({ sql, params }: QueryRequest): Promise<QueryResult> {
    const client = await this.createClient()
    
    try {
      const result = await client.query({
        text: sql,
        values: Object.values(params || {}),
      })

      return {
        rowCount: result.rowCount,
        fields: result.fields.map(field => ({
          name: field.name,
          type: this.convertDataType(field.dataTypeID),
        })),
        rows: result.rows.map(row => Object.values(row)),
      }
    } catch (error: unknown) {
      const errorObj = error as DatabaseError
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

  private convertDataType(dataTypeID: number, fallbackType = DataType.Unknown): DataType {
    switch (dataTypeID) {
      case types.builtins.BOOL:
        return DataType.Boolean
        
      case types.builtins.NUMERIC:
      case types.builtins.MONEY:
      case types.builtins.INT2:
      case types.builtins.INT4:
      case types.builtins.INT8:
        return DataType.Integer

      case types.builtins.FLOAT4:
      case types.builtins.FLOAT8:
        return DataType.Float

      case types.builtins.VARCHAR:
      case types.builtins.TEXT:
      case types.builtins.CHAR:
      case types.builtins.JSON:
      case types.builtins.XML:
        return DataType.String

      case types.builtins.DATE:
      case types.builtins.TIME:
      case types.builtins.TIMETZ:
      case types.builtins.TIMESTAMP:
      case types.builtins.TIMESTAMPTZ:
        return DataType.Datetime

      default:
        return fallbackType
    }
  }
}