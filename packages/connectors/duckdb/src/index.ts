import {
  BaseConnector,
  CompiledQuery,
  ConnectorError,
  ResolvedParam,
} from '@latitude-data/base-connector'
import QueryResult, { DataType, Field } from '@latitude-data/query_result'
import { Database, OPEN_READONLY, OPEN_READWRITE } from 'duckdb-async'

export type ConnectionParams = {
  url?: string
}

export class DuckdbConnector extends BaseConnector {
  private client?: Database
  private url: string

  constructor(rootPath: string, connectionParams: ConnectionParams) {
    super(rootPath)
    this.url = connectionParams.url || ':memory:'
  }

  end(): Promise<void> {
    if (this.client) return this.client.close()
    return Promise.resolve()
  }

  resolve(value: unknown): ResolvedParam {
    return {
      value,
      resolvedAs: '?',
    }
  }

  private async createClient(): Promise<void> {
    this.client = await Database.create(
      this.url,
      this.url === ':memory:' ? OPEN_READWRITE : OPEN_READONLY,
    )
  }

  async runQuery(query: CompiledQuery): Promise<QueryResult> {
    try {
      if (!this.client) await this.createClient()
      const conn = await this.client!.connect()

      let results = []
      if (query.params.length > 0) {
        const stmt = await conn.prepare(query.sql)
        results = await stmt.all(...this.buildQueryParams(query.params))
        stmt.finalize()
      } else {
        results = await conn.all(query.sql)
      }
      const rows = results.map((row) => Object.values(row))
      const rowCount = results.length
      const firstRow = results[0]
      const fields = firstRow
        ? Object.keys(firstRow).map(
            (key) =>
              ({
                name: key,
                type: DataType.String,
              }) as Field,
          )
        : []

      return new QueryResult({ fields, rows, rowCount })
    } catch (error) {
      throw new ConnectorError((error as Error).message)
    }
  }

  private buildQueryParams(params: ResolvedParam[]) {
    return params.map((param) => param.value)
  }
}
