import 'dotenv/config'
import * as fs from 'fs'
import path from 'path'

import type QueryResult from '@latitude-data/query_result'
import { BaseConnector } from '@/baseConnector'
import createConnectorFactory, {
  getConnectorPackage,
} from '@/baseConnector/connectorFactory'
import {
  BatchedQueryOptions,
  CompilationContext,
  ConnectionError,
  ConnectorType,
} from '@/types'
import { CompiledQuery, QueryConfig, QueryRequest, SourceSchema } from '@/types'
import SourceManager from '@/manager'
import { QueryMetadata } from '@latitude-data/sql-compiler'

export function buildDefaultContext(): Omit<CompilationContext, 'request'> {
  return {
    accessedParams: {},
    resolvedParams: [],
    ranQueries: {},
    queriesBeingCompiled: [],
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

  get connectionParams() {
    return this._schema.details ?? {}
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

  async getMetadataFromQuery(queryPath: string): Promise<QueryMetadata> {
    const sql = await this.getSql(queryPath)
    const connector = await this.connector()
    const request = { queryPath, sql, params: {} }
    const { config: queryConfig, ...rest } =
      await connector.readMetadata(request)
    return {
      config: {
        ...this.config,
        ...queryConfig,
      },
      ...rest,
    }
  }

  async compileQuery(
    { queryPath, params }: QueryRequest,
    context?: Omit<CompilationContext, 'request'>,
  ): Promise<CompiledQuery> {
    const sql = await this.getSql(queryPath)
    const connector = await this.connector()

    const defaultContext = buildDefaultContext()
    const fullContext = {
      ...defaultContext,
      ...context,
      request: { queryPath, sql, params: params ?? {} },
    }

    return await connector.compileQuery(fullContext)
  }

  async runCompiledQuery(compiledQuery: CompiledQuery): Promise<QueryResult> {
    const connector = await this.connector()
    return await connector.runCompiled(compiledQuery)
  }

  async batchQuery(
    compiledQuery: CompiledQuery,
    options: BatchedQueryOptions,
  ): Promise<void> {
    const connector = await this.connector()
    return connector.batchQuery(compiledQuery, options)
  }

  private async connector(): Promise<BaseConnector> {
    if (!this._connector) {
      this._connector = await createConnectorFactory({
        type: this.type,
        connectorOptions: {
          source: this,
          connectionParams: this.connectionParams,
        },
      })
    }

    return this._connector
  }

  private async getSql(queryPath: string): Promise<string> {
    const querySource = await this.manager.loadFromQuery(queryPath)

    if (this !== querySource) {
      throw new ConnectionError(
        `Query path "${queryPath}" is not in source "${this.path}"`,
      )
    }

    const cleanPath = queryPath.replace(/^\//, '')
    const sqlPath = path.resolve(
      this.manager.queriesDir,
      cleanPath.endsWith('.sql') ? cleanPath : `${cleanPath}.sql`,
    )

    return fs.readFileSync(sqlPath, 'utf8')
  }
}
