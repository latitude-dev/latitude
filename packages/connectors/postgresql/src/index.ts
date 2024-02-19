import {
  BaseConnector,
  ConnectionError,
  QueryError,
  CompiledQuery,
  ResolvedParam,
} from '@latitude-sdk/base-connector'
import QueryResult, { DataType } from '@latitude-sdk/query_result'
import pg from 'pg'

export type ConnectionParams = {
  database: string
  user: string
  password: string
  host: string
  port: number
  schema?: string
}

export class PostgresConnector extends BaseConnector {
  private pool

  constructor(rootPath: string, connectionParams: ConnectionParams) {
    super(rootPath)

    this.pool = new pg.Pool(connectionParams)

    if (connectionParams.schema) {
      this.pool.on('connect', (client) => {
        client.query(`SET search_path TO ${connectionParams.schema}`)
      })
    }
  }

  resolve(
    value: unknown,
    index: number,
  ): ResolvedParam {
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
      case pg.types.builtins.BOOL:
        return DataType.Boolean

      case pg.types.builtins.NUMERIC:
      case pg.types.builtins.MONEY:
      case pg.types.builtins.INT2:
      case pg.types.builtins.INT4:
      case pg.types.builtins.INT8:
        return DataType.Integer

      case pg.types.builtins.FLOAT4:
      case pg.types.builtins.FLOAT8:
        return DataType.Float

      case pg.types.builtins.VARCHAR:
      case pg.types.builtins.TEXT:
      case pg.types.builtins.CHAR:
      case pg.types.builtins.JSON:
      case pg.types.builtins.XML:
        return DataType.String

      case pg.types.builtins.DATE:
      case pg.types.builtins.TIME:
      case pg.types.builtins.TIMETZ:
      case pg.types.builtins.TIMESTAMP:
      case pg.types.builtins.TIMESTAMPTZ:
        return DataType.Datetime

      default:
        return fallbackType
    }
  }
}
