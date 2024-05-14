import {
  BaseConnector,
  CompiledQuery,
  ConnectorError,
  ConnectorOptions,
  ResolvedParam,
} from '@latitude-data/source-manager'
import QueryResult, { DataType, Field } from '@latitude-data/query_result'
import pkg from 'sqlite3'

const { Database, OPEN_READONLY, OPEN_READWRITE } = pkg

export type ConnectionParams = {
  url?: string
}

export default class SqliteConnector extends BaseConnector<ConnectionParams> {
  private url: string

  constructor(options: ConnectorOptions<ConnectionParams>) {
    super(options)

    this.url = options.connectionParams.url || ':memory:'
  }

  resolve(value: unknown): ResolvedParam {
    return {
      value,
      resolvedAs: '?',
    }
  }

  async runQuery(compiledQuery: CompiledQuery): Promise<QueryResult> {
    try {
      const client = new Database(
        this.url,
        this.url === ':memory:' ? OPEN_READWRITE : OPEN_READONLY,
        (err) => {
          if (err) {
            throw new ConnectorError(err.message)
          }
        },
      )

      const results = await new Promise<unknown[]>((resolve, reject) => {
        client.serialize(() => {
          client.all(
            compiledQuery.sql,
            this.buildQueryParams(compiledQuery.resolvedParams),
            (err, results) => {
              if (err) {
                reject(err)
              }

              client.close()
              resolve(results)
            },
          )
        })
      })

      const rows = results.map((row) =>
        Object.values(row as Record<string, unknown>),
      )
      const rowCount = results.length
      const firstRow = results[0]
      const fields = firstRow
        ? this.inferDataTypes(firstRow as Record<string, unknown>)
        : []

      return new QueryResult({ fields, rows, rowCount })
    } catch (error) {
      throw new ConnectorError((error as Error).message)
    }
  }

  private buildQueryParams(params: ResolvedParam[]) {
    return params.map((param) => param.value)
  }

  private inferDataTypes(row: Record<string, unknown>) {
    const fields: Field[] = []

    for (const [key, value] of Object.entries(row)) {
      const type = typeof value

      // IMPORTANT: Order matters
      if (type === 'number') {
        if (Number.isInteger(value)) {
          fields.push({ name: key, type: DataType.Integer })
        } else {
          fields.push({ name: key, type: DataType.Float })
        }
      } else if (type === 'boolean') {
        fields.push({ name: key, type: DataType.Boolean })
      } else if (!isNaN(Date.parse(value as string))) {
        fields.push({ name: key, type: DataType.Datetime })
      } else if (type === 'string') {
        fields.push({ name: key, type: DataType.String })
      } else {
        fields.push({ name: key, type: DataType.Unknown })
      }
    }

    return fields
  }
}
