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
    const {
      request,
      queriesBeingCompiled,
      accessedParams,
      ranQueries,
      resolvedParams,
    } = context
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

        this.checkQueryNotCompiled(fullSubQueryPath, queriesBeingCompiled)

        // Check query does not have accessedParams.

        const refSource =
          await this.source.manager.loadFromQuery(fullSubQueryPath)
        const compiledSubQuery = await refSource.compileQuery(
          {
            queryPath: fullSubQueryPath,
            params: context.request.params,
          },
          {
            accessedParams,
            resolvedParams,
            queryConfig: {}, // Subquery config does not affect the root query
            ranQueries,
            queriesBeingCompiled,
          },
        )

        return `(${compiledSubQuery.sql})`
      },
    }
  }
}
