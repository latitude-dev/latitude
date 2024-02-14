import path from 'path'
import fs from 'fs'
import { compile } from './compiler'
import type QueryResult from '@latitude-sdk/query_result'

import {
  type QueryRequest,
  type ResolvedParam,
  type CompiledQuery,
  ConnectorError,
} from './types'

export abstract class BaseConnector {
  private rootPath: string

  constructor(rootPath: string) {
    this.rootPath = rootPath
  }

  /**
   * While compiling the query, the connector will call this method to resolve the
   * parameterised string for a variable. Using the currently resolved parameters
   * as context, the connector should return the string to be used in the query in
   * order to parameterise the variable.
   * The name of the variable may be undefined, since it also resolves the result of
   * operations withing the query. This method could also be called with variables
   * already within the resolvedParams array.
   */
  protected abstract resolve(
    name: string | undefined,
    value: unknown,
    resolvedParams: ResolvedParam[],
  ): ResolvedParam

  /**
   * The connector should implement this method to execute the compiled query
   * and return the result.
   */
  protected abstract runQuery(request: CompiledQuery): Promise<QueryResult>
  protected async connect(): Promise<void> {}
  protected async disconnect(): Promise<void> {}

  private readQuery(queryPath: string): string {
    const fullQueryPath = path.join(
      this.rootPath,
      queryPath.endsWith('.sql') ? queryPath : `${queryPath}.sql`,
    )
    if (!fs.existsSync(fullQueryPath))
      throw new ConnectorError(`Query file not found: ${fullQueryPath}`)
    return fs.readFileSync(fullQueryPath, 'utf8')
  }

  async query(request: QueryRequest): Promise<QueryResult> {
    await this.connect()
    const compiledQuery = await compile({
      queryRequest: request,
      resolveFn: this.resolve.bind(this),
      readQueryFn: this.readQuery.bind(this),
      runQueryFn: this.runQuery.bind(this),
    })
    const queryResult = await this.runQuery(compiledQuery)
    await this.disconnect()
    return queryResult
  }
}

export * from './types'
export { SyntaxError } from './compiler'
