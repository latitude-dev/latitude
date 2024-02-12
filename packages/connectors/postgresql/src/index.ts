import { BaseConnector, QueryRequest, QueryResult, DataType, ConnectionError, QueryError } from '@latitude-dev/base-connector'
import { Pool, types, DatabaseError } from 'pg'

export type ConnectionParams = {
  database: string
  user: string
  password: string
  host: string
  port: number
}

export class PostgresConnector extends BaseConnector {
  private pool: Pool

  constructor(connectionParams: ConnectionParams) {
    super()
    this.pool = new Pool(connectionParams)
  }

  async query({ sql, params }: QueryRequest): Promise<QueryResult> {
    const client = await this.createClient()
    
    try {
      const result = await client.query({
        text: sql,
        values: params,
      })

      return {
        rowCount: result.rowCount,
        fields: result.fields.map(field => ({
          name: field.name,
          dataType: this.convertDataType(field.dataTypeID),
        })),
        payload: result.rows.map(row => Object.values(row)),
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