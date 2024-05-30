import path from 'path'
import {
  BaseConnector,
  CompiledQuery,
  ConnectorError,
  ConnectorOptions,
  Source,
  ResolvedParam,
  type BuildSupportedMethodsArgs,
} from '@latitude-data/source-manager'
import {
  emptyMetadata,
  type SupportedMethod,
} from '@latitude-data/sql-compiler'
import QueryResult, { DataType, Field } from '@latitude-data/query_result'
import { Database, OPEN_READONLY, OPEN_READWRITE } from 'duckdb-async'

export type ConnectionParams = {
  url?: string
}

export default class DuckdbConnector extends BaseConnector<ConnectionParams> {
  private client?: Database
  private url: string

  constructor(options: ConnectorOptions<ConnectionParams>) {
    super(options)
    this.url = options.connectionParams.url || ':memory:'
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

  protected buildSupportedMethods(
    buildArgs: BuildSupportedMethodsArgs,
  ): Record<string, SupportedMethod> {
    const supportedMethods = super.buildSupportedMethods(buildArgs)
    const { context } = buildArgs

    return {
      ...supportedMethods,
      materialized: {
        requirements: {
          interpolationPolicy: 'require',
          interpolationMethod: 'raw',
          requireStaticArguments: true,
        },
        resolve: async (referencedQuery: string) => {
          if (typeof referencedQuery !== 'string') {
            throw new Error('Invalid query name')
          }
          const fullSubQueryPath = referencedQuery.startsWith('/')
            ? referencedQuery
            : path.join(
                path.dirname(context.request.queryPath),
                referencedQuery,
              )

          if (
            context.queriesBeingCompiled.includes(
              fullSubQueryPath.replace(/.sql$/, ''),
            )
          ) {
            throw new Error(
              'Query reference to a parent, resulting in cyclic references.',
            )
          }

          const refSource = (await this.source.manager.loadFromQuery(
            fullSubQueryPath,
          )) as Source
          const { config, methods, sqlHash } =
            await refSource.getMetadataFromQuery(fullSubQueryPath)
          if (!config.materialize) {
            throw new Error(
              `Referenced query is not a materialized. \nYou can materialize it by adding {@config materialized_query = true} in the query content.`,
            )
          }

          const unsupportedMethods = ['param', 'runQuery']
          const unsupportedMethodsInQuery = Array.from(methods).filter(
            (method) => unsupportedMethods.includes(method),
          )
          if (unsupportedMethodsInQuery.length > 0) {
            const unsupportedMethodsStr = unsupportedMethodsInQuery.join(', ')
            throw new Error(
              `Referenced query must be static. It can not contain any of the following methods: ${unsupportedMethodsStr}`,
            )
          }

          const storage = await this.source.manager.materializeStorage
          const materializeUrl = await storage.getUrl({
            sqlHash,
            sourcePath: refSource.path,
            queryName: referencedQuery,
          })
          return `read_parquet('${materializeUrl}')`
        },
        readMetadata: async () => {
          return emptyMetadata()
        },
      },
    }
  }

  private async createClient(): Promise<void> {
    this.client = await Database.create(
      this.url,
      this.url === ':memory:' ? OPEN_READWRITE : OPEN_READONLY,
    )
  }

  async runQuery(compiledQuery: CompiledQuery): Promise<QueryResult> {
    try {
      if (!this.client) await this.createClient()
      const conn = await this.client!.connect()

      let results = []
      if (compiledQuery.resolvedParams.length > 0) {
        const stmt = await conn.prepare(compiledQuery.sql)
        results = await stmt.all(
          ...this.buildQueryParams(compiledQuery.resolvedParams),
        )
        stmt.finalize()
      } else {
        results = await conn.all(compiledQuery.sql)
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
