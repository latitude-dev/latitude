import 'dotenv/config'
import * as fs from 'fs'
import path from 'path'

import type QueryResult from '@latitude-data/query_result'
import { BaseConnector } from '@/baseConnector'
import createConnectorFactory, {
  getConnectorPackage,
} from '@/baseConnector/connectorFactory'
import { CompilationContext, ConnectionError, ConnectorType } from '@/types'
import { CompiledQuery, QueryConfig, QueryRequest, SourceSchema } from '@/types'
import SourceManager from '@/manager'

export function buildDefaultContext(): Omit<CompilationContext, 'request'> {
  return {
    accessedParams: {},
    resolvedParams: [],
    ranQueries: {},
    queriesBeingCompiled: [],
    queryConfig: {},
  }
}

export class Source {
  private _schema: SourceSchema
  private _connector?: BaseConnector
  readonly path: string
  readonly manager: SourceManager

  constructor({
    path,
    schema,
    sourceManager,
    connector,
  }: {
    path: string
    schema: SourceSchema
    sourceManager: SourceManager
    connector?: BaseConnector
  }) {
    this.path = path
    this._schema = schema
    this.manager = sourceManager
    this._connector = connector
  }

  get config(): QueryConfig {
    return this._schema?.config ?? {}
  }

  get type(): SourceSchema['type'] {
    return this._schema.type
  }

  get connectorPackageName(): string {
    const pkgName = getConnectorPackage(this.type as ConnectorType)
    return pkgName ?? ConnectorType.TestInternal
  }

  async endConnection(): Promise<void> {
    if (!this._connector) return
    await this._connector.end()
    this._connector = undefined
  }

  async compileQuery(
    { queryPath, params }: QueryRequest,
    context?: Omit<CompilationContext, 'request'>,
  ): Promise<CompiledQuery> {
    const defaultContext = buildDefaultContext()
    const querySource = await this.manager.loadFromQuery(queryPath)

    if (this !== querySource) {
      throw new ConnectionError(
        `Query path "${queryPath}" is not in source "${this.path}"`,
      )
    }

    const connector = await this.connector()
    const sql = this.getSql(queryPath)
    const fullContext = {
      ...defaultContext,
      ...context,
      request: { queryPath, sql, params: params ?? {} },
    }

    const compiledQuery = await connector.compileQuery(fullContext)
    compiledQuery.config = {
      ...this.config, // Default options from the source config file
      ...compiledQuery.config, // Options defined in the query file
    }
    return compiledQuery
  }

  async runCompiledQuery(compiledQuery: CompiledQuery): Promise<QueryResult> {
    const connector = await this.connector()
    return await connector.runCompiled(compiledQuery)
  }

  private async connector(): Promise<BaseConnector> {
    if (!this._connector) {
      this._connector = await createConnectorFactory({
        type: this.type,
        connectorOptions: {
          source: this,
          connectionParams: this._schema.details ?? {},
        },
      })
    }

    return this._connector
  }

  private getSql(queryPath: string): string {
    const cleanPath = queryPath.replace(/^\//, '')
    const sqlPath = path.resolve(
      this.manager.queriesDir,
      cleanPath.endsWith('.sql') ? cleanPath : `${cleanPath}.sql`,
    )

    return fs.readFileSync(sqlPath, 'utf8')
  }
}
