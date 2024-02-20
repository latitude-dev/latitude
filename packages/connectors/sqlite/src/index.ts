import {
  BaseConnector,
  CompiledQuery,
  ConnectorError,
  ResolvedParam,
} from '@latitude-sdk/base-connector'
import QueryResult, { DataType, Field } from '@latitude-sdk/query_result'
import pkg from 'sqlite3'

const { Database, OPEN_READONLY, OPEN_READWRITE } = pkg

export type ConnectionParams = {
  url?: string
}

export class SqliteConnector extends BaseConnector {
  private url: string

  constructor(rootPath: string, connectionParams: ConnectionParams) {
    super(rootPath)

    this.url = connectionParams.url || ':memory:'
  }

  resolve(value: unknown): ResolvedParam {
    return {
      value,
      resolvedAs: '?',
    }
  }

  async runQuery(query: CompiledQuery): Promise<QueryResult> {
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
            query.sql,
            this.buildQueryParams(query.params),
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
