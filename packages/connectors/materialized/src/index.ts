import {
  BuildSupportedMethodsArgs,
  ConnectorOptions,
  SupportedMethodsResponse,
} from '@latitude-data/source-manager'
import DuckdbConnector from '@latitude-data/duckdb-connector'

export type ConnectionParams = {}
export default class MaterializedConnector extends DuckdbConnector {
  constructor(options: ConnectorOptions<ConnectionParams>) {
    super({ ...options, connectionParams: {} })
  }

  buildSupportedMethods(
    args: BuildSupportedMethodsArgs,
  ): SupportedMethodsResponse {
    const context = args.context
    const { request, queriesBeingCompiled, ranQueries } = context
    const supportedMethods = super.buildSupportedMethods(args)
    return {
      ...supportedMethods,
      materializedRef: async <T extends boolean>(
        interpolation: T,
        referencedQuery: unknown,
      ): Promise<T extends true ? string : unknown> => {
        if (!interpolation) {
          throw new Error(
            'materializedRef function cannot be used inside a logic block',
          )
        }

        if (typeof referencedQuery !== 'string') {
          throw new Error('Invalid query name')
        }

        const fullSubQueryPath = this.getFullQueryPath({
          referencedQueryPath: referencedQuery,
          currentQueryPath: request.queryPath,
        })

        this.ensureQueryNotCompiled(fullSubQueryPath, queriesBeingCompiled)

        const refSource =
          await this.source.manager.loadFromQuery(fullSubQueryPath)
        const compiledSubQuery = await refSource.compileQuery(
          {
            queryPath: fullSubQueryPath,
            params: context.request.params,
          },
          {
            accessedParams: {},
            resolvedParams: [],
            queryConfig: {}, // Subquery config does not affect the root query
            ranQueries,
            queriesBeingCompiled,
          },
        )

        const materialize = compiledSubQuery.config.materialize_query
        const isFalse = materialize === false

        if (isFalse) {
          throw new Error(
            `Query '${fullSubQueryPath}' is not a materialized query. \nYou can have configured {@config materialized_query = false} in the query file. Set it to 'true'`,
          )
        } else if (!materialize) {
          throw new Error(
            `Query '${fullSubQueryPath}' is not a materialized query. \nYou can configure it by setting {@config materialized_query = true} in the query file.`,
          )
        } else if (Object.keys(compiledSubQuery.accessedParams).length > 0) {
          throw new Error(
            `'${referencedQuery}' query can not have parameters to filter the SQL query.`,
          )
        }

        const storage = await this.source.manager.materializeStorage
        const materializeUrl = await storage.getUrl({
          sql: compiledSubQuery.sql,
          queryPath: refSource.path,
          queryName: `materializedRef('${referencedQuery}')`,
        })

        return `(read_parquet('${materializeUrl}'))`
      },
    }
  }
}
