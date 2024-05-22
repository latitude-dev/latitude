import path from 'path'
import {
  compile,
  QueryMetadata,
  readMetadata,
  type CompileError,
} from '@latitude-data/sql-compiler'
import type QueryResult from '@latitude-data/query_result'
import { type QueryResultArray } from '@latitude-data/query_result'

import { Source } from '@/source'
import type {
  ResolvedParam,
  CompiledQuery,
  CompilationContext,
  BuildSupportedMethodsArgs,
  SupportedMethodsResponse,
} from '@/types'

export const CAST_METHODS: {
  [type: string]: (value: any) => unknown
} = {
  string: (value) => String(value),
  text: (value) => String(value),
  int: (value) => parseInt(value),
  float: (value) => parseFloat(value),
  number: (value) => Number(value),
  bool: (value) => Boolean(value),
  boolean: (value) => Boolean(value),
  date: (value) => new Date(value),
}
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
      context,
      resolveFn,
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
  readMetadata(sql: string): Promise<QueryMetadata> {
    // The supported methods object is only needed for their keys, but the actual
    // function implementations are not used, since they won't be called in this
    // process. Since some functions require context-specific information just to
    // be defined, they are mocked in this case.
    const supportedMethods = this.buildSupportedMethods({
      context: {
        request: {
          sql,
          queryPath: '', // will not be used
          params: {}, // will not be used
        },
        accessedParams: {},
        resolvedParams: [],
        ranQueries: {},
        queriesBeingCompiled: [],
      },
      resolveFn: async () => '',
    })
    return readMetadata({
      query: sql,
      supportedMethods,
    })
  }

  runCompiled(request: CompiledQuery): Promise<QueryResult> {
    return this.runQuery(request)
  }

  private buildSupportedMethods({
    context,
    resolveFn,
  }: BuildSupportedMethodsArgs): SupportedMethodsResponse {
    const {
      request,
      resolvedParams,
      accessedParams,
      ranQueries,
      queriesBeingCompiled,
    } = context

    const requestParams = request.params ?? {}

    const supportedMethods = {
      /**
       * Unsafely interpolates a value directly into the final query string.
       */
      interpolate: async <T extends boolean>(
        interpolation: T,
        value: unknown,
      ): Promise<string> => {
        if (!interpolation) {
          throw new Error(
            'interpolate function cannot be used inside a logic block',
          )
        }
        return String(value)
      },

      /**
       * Returns the value of a paramameter from the request.
       */
      param: async <T extends boolean>(
        interpolation: T,
        name: unknown,
        defaultValue?: unknown,
      ): Promise<T extends true ? string : unknown> => {
        if (typeof name !== 'string') throw new Error('Invalid parameter name')
        if (!(name in requestParams) && defaultValue === undefined) {
          throw new Error(`Missing parameter '${name}' in request`)
        }
        if (name in requestParams) {
          accessedParams[name] = requestParams[name]
        }
        const value = name in requestParams ? requestParams[name] : defaultValue

        const resolvedValue = interpolation ? await resolveFn(value) : value
        return resolvedValue as T extends true ? string : unknown
      },

      /**
       * Unsafely interpolates a value directly into the final query string.
       * @deprecated Use `interpolate(param(...))` instead.
       */
      unsafeParam: async <T extends boolean>(
        interpolation: T,
        name: unknown,
        defaultValue?: unknown,
      ): Promise<T extends true ? string : unknown> => {
        if (!interpolation) {
          throw new Error(
            'unsafeParam function cannot be used inside a logic block',
          )
        }
        if (typeof name !== 'string') throw new Error('Invalid parameter name')
        if (!(name in requestParams) && defaultValue === undefined) {
          throw new Error(`Missing parameter '${name}' in request`)
        }
        if (name in requestParams) {
          accessedParams[name] = requestParams[name]
        }
        const value = name in requestParams ? requestParams[name] : defaultValue

        return String(value)
      },

      /**
       * Casts a value to a specific type.
       */
      cast: async <T extends boolean>(
        interpolation: T,
        value: unknown,
        type: unknown,
      ): Promise<T extends true ? string : unknown> => {
        if (typeof type !== 'string') throw new Error('Invalid cast type')
        if (!(type in CAST_METHODS)) {
          throw new Error(`Unsupported cast type: '${type}'`)
        }
        const parsedValue = CAST_METHODS[type]!(value)

        const resolvedValue = interpolation
          ? await resolveFn(parsedValue)
          : parsedValue
        return resolvedValue as T extends true ? string : unknown
      },

      /**
       * Compiles a subquery and includes the result into the final query string.
       */
      ref: async <T extends boolean>(
        interpolation: T,
        referencedQuery: unknown,
      ): Promise<T extends true ? string : unknown> => {
        if (typeof referencedQuery !== 'string')
          throw new Error('Invalid query name')
        if (!interpolation) {
          throw new Error('ref function cannot be used inside a logic block')
        }

        const fullSubQueryPath = this.getFullQueryPath({
          referencedQueryPath: referencedQuery,
          currentQueryPath: request.queryPath,
        })

        this.ensureQueryNotCompiled(fullSubQueryPath, queriesBeingCompiled)

        await this.ensureSameSource(fullSubQueryPath)

        const compiledSubQuery = await this.source.compileQuery(
          {
            queryPath: fullSubQueryPath,
            params: context.request.params,
          },
          {
            accessedParams,
            resolvedParams,
            ranQueries,
            queriesBeingCompiled,
          },
        )

        return `(${compiledSubQuery.sql})`
      },

      /**
       * Compiles and runs a subquery and returns the result.
       */
      runQuery: async <T extends boolean>(
        interpolation: T,
        referencedQuery: unknown,
      ): Promise<T extends true ? string : QueryResultArray> => {
        if (typeof referencedQuery !== 'string')
          throw new Error('Invalid query name')
        if (interpolation) {
          throw new Error(
            'runQuery function cannot be directly interpolated into the query',
          )
        }
        const fullSubQueryPath = this.getFullQueryPath({
          referencedQueryPath: referencedQuery,
          currentQueryPath: request.queryPath,
        })

        if (fullSubQueryPath in ranQueries) {
          return ranQueries[fullSubQueryPath] as T extends true
            ? string
            : QueryResultArray
        }

        this.ensureQueryNotCompiled(fullSubQueryPath, queriesBeingCompiled)

        const refSource =
          await this.source.manager.loadFromQuery(fullSubQueryPath)
        const compiledSubQuery = await refSource.compileQuery(
          {
            queryPath: fullSubQueryPath,
            params: {},
          },
          {
            accessedParams,
            resolvedParams: [], // Subquery should not have access to parent queries' resolved parameters
            ranQueries,
            queriesBeingCompiled,
          },
        )

        const subQueryResults = await this.runQuery(compiledSubQuery).then(
          (result) => result.toArray(),
        )
        ranQueries[fullSubQueryPath] = subQueryResults
        return subQueryResults as T extends true ? string : QueryResultArray
      },
    }

    return supportedMethods
  }

  private async ensureSameSource(refQueryPath: string): Promise<Source> {
    const refSource = await this.source.manager.loadFromQuery(refQueryPath)

    if (refSource !== this.source) {
      throw new Error('Query reference to a different source')
    }

    return refSource
  }

  protected getFullQueryPath({
    referencedQueryPath,
    currentQueryPath,
  }: {
    referencedQueryPath: string
    currentQueryPath: string
  }): string {
    return referencedQueryPath.startsWith('/')
      ? referencedQueryPath
      : path.join(path.dirname(currentQueryPath), referencedQueryPath)
  }

  protected ensureQueryNotCompiled(
    queryPath: string,
    queriesBeingCompiled: string[],
  ): void {
    const queryName = queryPath.replace(/.sql$/, '')

    if (!queriesBeingCompiled.includes(queryName)) return

    throw new Error(
      'Query reference to a parent, resulting in cyclic references.',
    )
  }
}
