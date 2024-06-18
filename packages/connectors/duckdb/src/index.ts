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
import {
  Database,
  OPEN_READONLY,
  OPEN_READWRITE,
  TableData,
} from 'duckdb-async'

type S3Credentials = {
  accessKeyId: string
  secretAccessKey: string
  region: string
}

export type ConnectionParams = {
  url?: string
  s3?: S3Credentials
}

export class MaterializedFileNotFoundError extends Error {}

export default class DuckdbConnector extends BaseConnector<ConnectionParams> {
  private client?: Database
  private url: string
  private s3?: S3Credentials

  constructor(options: ConnectorOptions<ConnectionParams>) {
    super(options)
    this.url = options.connectionParams.url || ':memory:'
    this.s3 = options.connectionParams.s3
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

          // Check requirements:

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
          const { config, methods } =
            await refSource.getMetadataFromQuery(fullSubQueryPath)
          if (!config.materialize) {
            throw new Error(
              `Query '${fullSubQueryPath}' is not configured to be materialized. You can materialize it by adding {@config materialize = true}.`,
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

          const materializedStorage = this.source.manager.materializedStorage
          const materializedPath =
            await this.source.manager.localMaterializationPath(fullSubQueryPath)
          const materializedFileExists =
            await materializedStorage.exists(materializedPath)
          if (!materializedFileExists) {
            throw new MaterializedFileNotFoundError(
              `Query '${fullSubQueryPath}' is not materialized. Run 'latitude materialize' to materialize it.`,
            )
          }

          // Resolve URL of the materialized file

          const sourceManager = this.source.manager
          const materializedUrl =
            await sourceManager.materializationUrl(fullSubQueryPath)
          return `read_parquet('${materializedUrl}')`
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
    if (this.s3) {
      await this.connectS3(this.s3)
    }
  }

  private async connectS3(credentials: ConnectionParams['s3']): Promise<void> {
    if (!credentials) return
    const { accessKeyId, secretAccessKey, region } = credentials
    const query = `
INSTALL httpfs;
LOAD httpfs;
CREATE SECRET (
  TYPE S3,
  KEY_ID ${JSON.stringify(accessKeyId)},
  SECRET ${JSON.stringify(secretAccessKey)},
  REGION ${JSON.stringify(region)}
);`

    await this.client!.exec(query)
  }

  async runQuery(compiledQuery: CompiledQuery): Promise<QueryResult> {
    try {
      const describeQuery = `DESCRIBE (${compiledQuery.sql})`
      const describeResults = await this.performQuery({
        ...compiledQuery,
        sql: describeQuery,
      })
      const fields = describeResults.map(
        (row) =>
          ({
            name: row['column_name'],
            type: this.convertDataType(row['column_type']),
          }) as Field,
      )

      const results = await this.performQuery(compiledQuery)
      const rows = results.map((row) => Object.values(row))
      const rowCount = results.length

      return new QueryResult({ fields, rows, rowCount })
    } catch (error) {
      throw new ConnectorError((error as Error).message)
    }
  }

  private async performQuery(compiledQuery: CompiledQuery): Promise<TableData> {
    if (!this.client) await this.createClient()
    const conn = await this.client!.connect()

    if (compiledQuery.resolvedParams.length === 0) {
      return await conn.all(compiledQuery.sql)
    }

    const stmt = await conn.prepare(compiledQuery.sql)
    const results = await stmt.all(
      ...this.buildQueryParams(compiledQuery.resolvedParams),
    )
    stmt.finalize()
    return results
  }

  private convertDataType(
    dataType: string,
    fallback = DataType.Unknown,
  ): DataType {
    switch (dataType.toUpperCase()) {
      case 'BOOLEAN':
      case 'BOOL':
      case 'LOGICAL':
        return DataType.Boolean

      case 'DATE':
      case 'TIME':
      case 'TIMESTAMP':
      case 'DATETIME':
      case 'TIMESTAMPTZ':
        return DataType.Datetime

      case 'DOUBLE':
      case 'FLOAT8':
      case 'REAL':
      case 'FLOAT4':
      case 'FLOAT':
      case 'DECIMAL':
      case 'NUMERIC':
        return DataType.Float

      case 'BIGINT':
      case 'INT8':
      case 'LONG':
      case 'HUGEINT':
      case 'INTEGER':
      case 'INT4':
      case 'INT':
      case 'SIGNED':
      case 'SMALLINT':
      case 'INT2':
      case 'SHORT':
      case 'TINYINT':
      case 'INT1':
      case 'UBIGINT':
      case 'UHUGEINT':
      case 'UINTEGER':
      case 'USMALLINT':
      case 'UTINYINT':
        return DataType.Integer

      case 'VARCHAR':
      case 'CHAR':
      case 'BPCHAR':
      case 'TEXT':
      case 'STRING':
      case 'UUID':
      case 'BIT':
      case 'BITSTRING':
      case 'BLOB':
      case 'BYTEA':
      case 'BINARY':
      case 'VARBINARY':
        return DataType.String

      default:
        return fallback
    }
  }

  private buildQueryParams(params: ResolvedParam[]) {
    return params.map((param) => param.value)
  }
}
