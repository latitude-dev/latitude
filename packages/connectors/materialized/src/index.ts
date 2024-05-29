import {
  type BuildSupportedMethodsArgs,
  ConnectorOptions,
  Source,
} from '@latitude-data/source-manager'
import DuckdbConnector from '@latitude-data/duckdb-connector'
import {
  emptyMetadata,
  type SupportedMethod,
} from '@latitude-data/sql-compiler'
import path from 'path'

export type ConnectionParams = {}
export default class MaterializedConnector extends DuckdbConnector {
  constructor(options: ConnectorOptions<ConnectionParams>) {
    super({ ...options, connectionParams: {} })
  }

  protected buildSupportedMethods(
    buildArgs: BuildSupportedMethodsArgs,
  ): Record<string, SupportedMethod> {
    const supportedMethods = super.buildSupportedMethods(buildArgs)
    const { context } = buildArgs

    return {
      ...supportedMethods,
      materializedRef: {
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
          if (!config.materialize_query) {
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
}
