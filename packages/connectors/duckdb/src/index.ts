import path from 'path'
import {
  BaseConnector,
  CompiledQuery,
  ConnectorError,
  ConnectorOptions,
  Source,
  ResolvedParam,
  type BuildSupportedMethodsArgs,
  BatchedQueryOptions,
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

          const unsupportedMethods = ['param', 'runQuery', 'materialized']
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
  
  async batchQuery(
    compiledQuery: CompiledQuery,
    { batchSize, onBatch }: BatchedQueryOptions,
  ): Promise<void> {
    try {
      let offset = 0
      let hasMoreRows = true
      let fields: Field[] | undefined

      while (hasMoreRows) {
        const paginatedQuery = `SELECT * FROM (${compiledQuery.sql}) LIMIT ${batchSize} OFFSET ${offset}`
        const results = await this.runQuery({
          ...compiledQuery,
          sql: paginatedQuery,
        })

        hasMoreRows = results.rowCount === batchSize

        if (fields === undefined) {
          fields = results.fields
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
