import { BaseConnector, ConnectorOptions } from '@/baseConnector'
import {
  BatchedQueryOptions,
  CompiledQuery,
  ConnectionError,
  ConnectorError,
  ResolvedParam,
} from '@/types'
import QueryResult, { DataType } from '@latitude-data/query_result'

export type ConnectionParams = {
  fail?: string | false // Connection will fail with the given message
  onResolve?: (value: unknown, resolvedParam: ResolvedParam) => void
  onRunQuery?: (
    compiledQuery: CompiledQuery,
    result?: QueryResult,
    error?: Error,
  ) => void
}

/**
 * This is a mock connector that can be used for testing purposes.
 * It does not connect to any database and returns a result based on
 * the input query.
 *
 * Each line in the query will represent a new row in the result, as
 * a 'value' field.
 * Resolved values are shown in the result as `[[value]]`
 *
 * A line can also start with one of the following keywords to define
 * different behaviors:
 * - `FAIL <message>` will throw an error with the given message.
 * - `SLEEP <ms>` will wait for the given number of milliseconds.
 */
export default class TestConnector extends BaseConnector<ConnectionParams> {
  private onResolve?: (value: unknown, resolvedParam: ResolvedParam) => void
  private onRunQuery?: (
    compiledQuery: CompiledQuery,
    result?: QueryResult,
    error?: Error,
  ) => void

  constructor(options: ConnectorOptions<ConnectionParams>) {
    super(options)
    const connectionParams = options.connectionParams

    if (connectionParams?.fail) {
      throw new ConnectionError(connectionParams.fail)
    }
    this.onResolve = connectionParams?.onResolve
    this.onRunQuery = connectionParams?.onRunQuery
  }

  resolve(value: unknown): ResolvedParam {
    const resolvedParam = {
      value,
      resolvedAs: `[[${value}]]`,
    }
    this?.onResolve?.(value, resolvedParam)
    return resolvedParam
  }

  async batchQuery(
    compiledQuery: CompiledQuery,
    options: BatchedQueryOptions,
  ): Promise<void> {
    return Promise.reject(
      new Error(`
        batchQuery not implemented for TestConnector
        Mock it in your tests
        CompiledQuery: ${JSON.stringify(compiledQuery)}
        batchOptions: ${JSON.stringify(options)}
      `),
    )
  }

  async runQuery(compiledQuery: CompiledQuery): Promise<QueryResult> {
    const lines = compiledQuery.sql.split('\n')
    const rows = []
    const commands = ['FAIL', 'SLEEP']
    for (const line of lines) {
      const command = commands.find((c) => line.trim().startsWith(c))
      const content = line
        .trim()
        .slice(command?.length)
        .trim()

      if (command === 'FAIL') {
        this?.onRunQuery?.(
          compiledQuery,
          undefined,
          new ConnectorError(content),
        )
        throw new ConnectorError(content)
      }

      if (command === 'SLEEP') {
        const time = parseInt(content, 10)
        await new Promise((resolve) => setTimeout(resolve, time))
        continue
      }

      rows.push(content)
    }

    const result = new QueryResult({
      fields: [{ name: 'value', type: DataType.String }],
      rows: rows.map((value) => [value]),
      rowCount: rows.length,
    })

    if (this.onRunQuery) this.onRunQuery(compiledQuery, result)
    return result
  }
}
