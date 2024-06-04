import {
  compile,
  QueryMetadata,
  readMetadata,
  SupportedMethod,
  type CompileError,
} from '@latitude-data/sql-compiler'
import type QueryResult from '@latitude-data/query_result'

import { Source } from '@/source'
import {
  type ResolvedParam,
  type CompiledQuery,
  type CompilationContext,
  type BuildSupportedMethodsArgs,
  type CompileQueryRequest,
  type BatchedQueryOptions,
  type QueryConfig,
  ConnectorError,
} from '@/types'
import buildSupportedMethods from './supportedMethods'
import type { Field } from '@latitude-data/query_result'

export type ConnectorAttributes = {
  [key: string]: unknown
}
export { CompileError }
export type ConnectorOptions<P extends ConnectorAttributes> = {
  source: Source
  connectionParams: P
}

export abstract class BaseConnector<P extends ConnectorAttributes = {}> {
  protected source: Source

  constructor({ source }: ConnectorOptions<P>) {
    this.source = source
  }

  /**
   * While compiling the query, the connector will call this method to resolve the
   * parameterised string for a variable. The index is the position of this variable
   * in the array of ResolvedParams that will be passed to the runQuery method.
   */
  protected abstract resolve(value: unknown, index: number): ResolvedParam

  /**
   * Perform the actual query execution on the data source.
   */
  protected abstract runQuery(request: CompiledQuery): Promise<QueryResult>

  /**
   * Paginate a query by wrapping it in a subquery and using LIMIT and OFFSET
   */
  protected paginateQuery(sql: string, limit: number, offset: number): string {
    // `sql` must be wrapped as a subquery, because it could already contain LIMIT and OFFSET set by the user
    return `SELECT * FROM (${sql}) LIMIT ${limit} OFFSET ${offset}`
  }

  /**
   * The connector is able to perform streaming (batching) of the results
   * of a query. If the connector does not define this method it will throw
   */
  async batchQuery(
    compiledQuery: CompiledQuery,
    { batchSize, onBatch }: BatchedQueryOptions,
  ): Promise<void> {
    try {
      let offset = 0
      let hasMoreRows = true
      let fields: Field[] | undefined

      while (hasMoreRows) {
        const paginatedQuery = this.paginateQuery(
          compiledQuery.sql,
          batchSize,
          offset,
        )
        const results = await this.runQuery({
          ...compiledQuery,
          sql: paginatedQuery,
        })

        hasMoreRows = results.rowCount === batchSize

        if (fields === undefined) {
          fields = results.fields // Only set the fields on the first batch
        }

        await onBatch({
          rows: results.toArray(),
          fields: fields,
          lastBatch: !hasMoreRows,
        })

        offset += batchSize
      }
    } catch (error) {
      throw new ConnectorError((error as Error).message)
    }
  }

  /**
   * Close the connection to the data source.
   * This method must only be called once all queries have been executed and the
   * connector instance is no longer needed.
   */
  async end(): Promise<void> {}

  /**
   * Compile the given query. This method returns the compiled SQL, resolved parameters,
   * and information about the compilation process.
   */
  async compileQuery(context: CompilationContext): Promise<CompiledQuery> {
    const { request, resolvedParams, accessedParams, queriesBeingCompiled } =
      context
    queriesBeingCompiled.push(request.queryPath)

    const resolveFn = async (value: unknown): Promise<string> => {
      const resolved = this.resolve(value, resolvedParams.length)
      resolvedParams.push(resolved)
      return resolved.resolvedAs
    }

    const supportedMethods = this.buildSupportedMethods({
      source: this.source,
      context,
    })

    const compiledSql = await compile({
      supportedMethods,
      query: request.sql,
      resolveFn,
    })

    // NOTE: To avoid compiling subqueries that have already
    // been compiled in the current call stack.
    queriesBeingCompiled.pop()

    return {
      sql: compiledSql,
      resolvedParams,
      accessedParams,
    }
  }

  /**
   * Parses the query and returns the configuration defined and methods used.
   * This definition is static, and only depends on the contents of the query
   * itself.
   */
  readMetadata(
    request: CompileQueryRequest,
  ): Promise<QueryMetadata<QueryConfig>> {
    // The supported methods object is only needed for their keys, but the actual
    // function implementations are not used, since they won't be called in this
    // process. Since some functions require context-specific information just to
    // be defined, they are mocked in this case.
    const supportedMethods = this.buildSupportedMethods({
      context: {
        request,
        accessedParams: {},
        resolvedParams: [],
        ranQueries: {},
        queriesBeingCompiled: [],
      },
      source: this.source,
    })

    return readMetadata({
      query: request.sql,
      supportedMethods,
    })
  }

  runCompiled(request: CompiledQuery): Promise<QueryResult> {
    return this.runQuery(request)
  }

  protected buildSupportedMethods(
    buildArgs: BuildSupportedMethodsArgs,
  ): Record<string, SupportedMethod> {
    return buildSupportedMethods(buildArgs)
  }
}
