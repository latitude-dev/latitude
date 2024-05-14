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

        this.ensureQueryNotCompiled(fullSubQueryPath, queriesBeingCompiled)

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
        } else if (Object.keys(accessedParams).length > 0) {
          const usedParams = this.concatenateParams(accessedParams)
          throw new Error(
            `'${referencedQuery}' query can not have parameters to filter the SQL query. You're using ${usedParams} params in the query`,
          )
        }

        // TODO: Read stored materielized query from MaterializeStorage
        // materializeStorage will be done in a separate PR
        // Fail with a specific error if the query is not materialized?

        // TODO: Get somehow from DuckDB when the query was last materialized
        // Or maybe just the timestamp from the file system
        return `(${compiledSubQuery.sql})`
      },
    }
  }

  private concatenateParams(params: Record<string, unknown>): string {
    const paramsKeys = Object.keys(params)
    if (paramsKeys.length === 0) return ''

    const quotedKeys = paramsKeys.map((key) => `'${key}'`)

    const restKeys = quotedKeys.slice(0, -1).join(', ')
    const lastKey = quotedKeys.slice(-1)
    return `${restKeys} and ${lastKey}`
  }
}
