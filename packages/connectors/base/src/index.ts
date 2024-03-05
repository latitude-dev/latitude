import path from 'path'
import * as fs from 'fs'
import compile, {
  type CompileError,
  type SupportedMethod,
} from '@latitude-data/sql-compiler'
import type QueryResult from '@latitude-data/query_result'
import { type QueryResultArray } from '@latitude-data/query_result'

import {
  type QueryRequest,
  type ResolvedParam,
  type CompiledQuery,
  ConnectorError,
  QueryParams,
} from './types'

export abstract class BaseConnector {
  private rootPath: string

  constructor(rootPath: string) {
    this.rootPath = rootPath
  }

  /**
   * While compiling the query, the connector will call this method to resolve the
   * parameterised string for a variable. The index is the position of this variable
   * in the array of ResolvedParams that will be passed to the runQuery method.
   */
  protected abstract resolve(value: unknown, index: number): ResolvedParam

  protected abstract runQuery(request: CompiledQuery): Promise<QueryResult>
  protected async connect(): Promise<void> {}
  protected async disconnect(): Promise<void> {}

  async run(request: QueryRequest): Promise<QueryResult> {
    await this.connect()

    const resolvedParams: ResolvedParam[] = []
    const ranQueries: Record<string, QueryResultArray> = {}
    const queriesBeingCompiled: string[] = []

    try {
      return await this._query({
        request,
        resolvedParams,
        ranQueries,
        queriesBeingCompiled,
      })
    } finally {
      await this.disconnect()
    }
  }

  async runCompiled(request: CompiledQuery): Promise<QueryResult> {
    await this.connect()

    try {
      return await this.runQuery(request)
    } finally {
      await this.disconnect()
    }
  }

  async compileQuery(
    request: QueryRequest,
  ): Promise<{ compiledQuery: string; resolvedParams: ResolvedParam[] }> {
    const resolvedParams: ResolvedParam[] = []
    const ranQueries: Record<string, QueryResultArray> = {}
    const queriesBeingCompiled: string[] = []

    const { compiledQuery } = await this._compileQuery({
      request,
      resolvedParams,
      ranQueries,
      queriesBeingCompiled,
    })

    return { compiledQuery, resolvedParams }
  }

  private async _query({
    request,
    resolvedParams,
    ranQueries,
    queriesBeingCompiled,
  }: {
    request: QueryRequest
    resolvedParams: ResolvedParam[]
    ranQueries: Record<string, QueryResultArray> // Ran query results are cached to avoid re-running the same query
    queriesBeingCompiled: string[] // Used to detect cyclic references
  }): Promise<QueryResult> {
    const { compiledQuery } = await this._compileQuery({
      request,
      resolvedParams,
      ranQueries,
      queriesBeingCompiled,
    })

    return this.runQuery({
      sql: compiledQuery,
      params: resolvedParams,
    })
  }

  private async _compileQuery({
    request,
    resolvedParams,
    ranQueries,
    queriesBeingCompiled,
  }: {
    request: QueryRequest
    resolvedParams: ResolvedParam[]
    ranQueries: Record<string, QueryResultArray> // Ran query results are cached to avoid re-running the same query
    queriesBeingCompiled: string[] // Used to detect cyclic references
  }): Promise<{ compiledQuery: string; resolvedParams: ResolvedParam[] }> {
    const fullQueryName = this.fullQueryPath(request.queryPath)
    queriesBeingCompiled.push(fullQueryName)

    const query = this.readQuery(fullQueryName)
    const params = request.params || {}
    const resolveFn = async (value: unknown): Promise<string> => {
      const resolved = this.resolve(value, resolvedParams.length)
      resolvedParams.push(resolved)
      return resolved.resolvedAs
    }
    const supportedMethods = this.buildSupportedMethods({
      params,
      resolveFn,
      ranQueries,
      queriesBeingCompiled,
    })
    const compiledQuery = await compile({
      query,
      resolveFn,
      supportedMethods,
    })

    // NOTE: To avoid compiling subqueries that have already been compiled in
    // the current call stack.
    queriesBeingCompiled.pop()

    return {
      compiledQuery,
      resolvedParams,
    }
  }

  private fullQueryPath(queryName: string): string {
    return path.join(
      this.rootPath,
      queryName.endsWith('.sql') ? queryName : `${queryName}.sql`,
    )
  }

  private readQuery(fullQueryPath: string): string {
    if (!fs.existsSync(fullQueryPath))
      throw new ConnectorError(`Query file not found: ${fullQueryPath}`)
    return fs.readFileSync(fullQueryPath, 'utf8')
  }

  private buildSupportedMethods({
    params,
    resolveFn,
    ranQueries,
    queriesBeingCompiled,
  }: {
    params: QueryParams
    resolveFn: (value: unknown) => Promise<string>
    ranQueries: Record<string, QueryResultArray>
    queriesBeingCompiled: string[]
  }): Record<string, SupportedMethod> {
    const supportedMethods = {
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
      param: async <T extends boolean>(
        interpolation: T,
        name: unknown,
        defaultValue?: unknown,
      ): Promise<T extends true ? string : unknown> => {
        if (typeof name !== 'string') throw new Error('Invalid parameter name')
        if (!(name in params) && defaultValue === undefined) {
          throw new Error(`Missing parameter '${name}' in request`)
        }
        const value = name in params ? params[name] : defaultValue

        const resolvedValue = interpolation ? await resolveFn(value) : value
        return resolvedValue as T extends true ? string : unknown
      },
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
        if (!(name in params) && defaultValue === undefined) {
          throw new Error(`Missing parameter '${name}' in request`)
        }
        const value = name in params ? params[name] : defaultValue

        return String(value)
      },
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
      ref: async <T extends boolean>(
        interpolation: T,
        queryName: unknown,
      ): Promise<T extends true ? string : unknown> => {
        if (typeof queryName !== 'string') throw new Error('Invalid query name')
        if (!interpolation) {
          throw new Error('ref function cannot be used inside a logic block')
        }
        const fullSubQueryPath = this.fullQueryPath(queryName)
        if (queriesBeingCompiled.includes(fullSubQueryPath)) {
          throw new Error(
            'Query reference to a parent, resulting in cyclic references.',
          )
        }

        queriesBeingCompiled.push(fullSubQueryPath)
        const subQuery = this.readQuery(fullSubQueryPath)

        const compiledSubQuery = await compile({
          query: subQuery,
          resolveFn,
          supportedMethods,
        })
        queriesBeingCompiled.pop()

        return `(${compiledSubQuery})`
      },
      runQuery: async <T extends boolean>(
        interpolation: T,
        queryName: unknown,
      ): Promise<T extends true ? string : QueryResultArray> => {
        if (typeof queryName !== 'string') throw new Error('Invalid query name')
        if (interpolation) {
          throw new Error(
            'runQuery function cannot be directly interpolated into the query',
          )
        }
        const fullSubQueryPath = this.fullQueryPath(queryName)
        if (fullSubQueryPath in ranQueries) {
          return ranQueries[fullSubQueryPath] as T extends true
            ? string
            : QueryResultArray
        }
        if (queriesBeingCompiled.includes(fullSubQueryPath)) {
          throw new Error(
            'Query reference to a parent, resulting in cyclic references.',
          )
        }

        const subQueryResults = (
          await this._query({
            request: { queryPath: queryName, params },
            resolvedParams: [],
            ranQueries,
            queriesBeingCompiled,
          })
        ).toArray()
        ranQueries[fullSubQueryPath] = subQueryResults
        return subQueryResults as T extends true ? string : QueryResultArray
      },
    }

    return supportedMethods
  }
}

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

export * from './types'
export { CompileError }
