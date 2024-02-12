import { BaseConnector, QueryResult, DataType, ConnectionError, QueryError, SequentialCompiledParams, CompiledQuery } from '@latitude-dev/base-connector'
import { Pool, types, DatabaseError } from 'pg'

export type ConnectionParams = {
  database: string
  user: string
  password: string
  host: string
  port: number
  schema?: string
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

  /**
   * Postgres parameterises variables sequentially, so this popParams() method must
   * return a SequentialCompiledParams. But in order to reuse the same resolved string
   * for the same parameter, we must save the varName while resolving them.
   */
  private resolvedParams: { varName: string, value: unknown }[] = []

  /**
   * The pg library parameterises variables as $i where i is an increasing number starting
   * from 1, for regular variables, and $i::text for strings.
   */
  resolve(varName: string, value: unknown): string {
    let index = this.resolvedParams.findIndex(param => param.varName === varName)
    if (index === -1) {
      this.resolvedParams.push({
        varName,
        value,
      })
      index = this.resolvedParams.length - 1
    }

    const isText = typeof value === 'string'
    return `$${index + 1}${isText ? '::text' : ''}`
  }

  popParams(): SequentialCompiledParams {
    const pop = this.resolvedParams
    this.resolvedParams = []
    return pop.map(param => param.value)
  }

  async runQuery(request: CompiledQuery): Promise<QueryResult> {
    const client = await this.createClient()
    
    try {
      const result = await client.query({
        text: request.sql,
        values: Object.values(request.params || {}),
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