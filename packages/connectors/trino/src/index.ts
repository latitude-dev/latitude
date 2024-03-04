import {
  BaseConnector,
  QueryError,
  CompiledQuery,
  ResolvedParam,
} from '@latitude-data/base-connector'
import QueryResult, { DataType, Field } from '@latitude-data/query_result'
import { Trino, BasicAuth } from 'trino-client'

export type ConnectionParams = {
  server: string
  catalog?: string
  schema?: string
  username: string
  password?: string
}

export class TrinoConnector extends BaseConnector {
  private client: Trino

  constructor(rootPath: string, connectionParams: ConnectionParams) {
    super(rootPath)
    this.client = Trino.create({
      server: connectionParams.server,
      catalog: connectionParams.catalog,
      schema: connectionParams.schema,
      auth: new BasicAuth(connectionParams.username, connectionParams.password),
    })
  }

  resolve(value: unknown, _: number): ResolvedParam {
    return {
      value,
      resolvedAs: '?',
    }
  }

  async runQuery(request: CompiledQuery): Promise<QueryResult> {
    let query = request.sql
    if (request.params.length) {
      const preparedQuery = `PREPARE request_query FROM (${request.sql})`
      const prepareIter = await this.client.query(preparedQuery)
      for await (const data of prepareIter) {
        if (data.error) {
          throw new QueryError(data.error.message)
        }
      }
      query = `EXECUTE request_query USING ${request.params
        .map((param) => this.stringify(param.value))
        .join(', ')}`
    }
    const iter = await this.client.query(query)

    const rows: unknown[][] = []
    let fields: Field[] = []
    for await (const data of iter) {
      if (data.error) {
        throw new QueryError(data.error.message)
      }

      if (!fields.length && data.columns) {
        fields = data.columns.map((column) => ({
          name: column.name,
          type: this.convertDataType(column.type),
        }))
      }
      rows.push(...(data.data ?? []))
    }

    return new QueryResult({
      rowCount: rows.length,
      fields,
      rows,
    })
  }

  private stringify(value: unknown): string {
    if (typeof value === 'string') {
      return `'${value.replace(/'/g, "''")}'` // Escape single quotes
    }
    return String(value)
  }

  private convertDataType(
    dataType: string,
    fallbackType = DataType.Unknown,
  ): DataType {
    switch (dataType.toLowerCase().split('(')[0]) {
      case 'boolean':
        return DataType.Boolean
      case 'integer':
      case 'int':
      case 'bigint':
      case 'smallint':
      case 'tinyint':
        return DataType.Integer
      case 'real':
      case 'double':
      case 'decimal':
        return DataType.Float
      case 'varchar':
      case 'char':
      case 'string':
        return DataType.String
      case 'date':
      case 'time':
      case 'timestamp':
        return DataType.Datetime
      default:
        return fallbackType
    }
  }
}
