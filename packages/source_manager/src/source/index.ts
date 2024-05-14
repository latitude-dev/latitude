import 'dotenv/config'

import type QueryResult from '@latitude-data/query_result'
import {
  CompiledQuery,
  QueryConfig,
  QueryRequest,
  BaseConnector,
} from '@/baseConnector'
import createConnectorFactory, {
  ConnectorType,
  getConnectorPackage,
} from '@/baseConnector/connectorFactory'
import { SourceSchema } from '@/types'
import SourceManager from '@/manager'

export class Source {
  private _schema: SourceSchema
  private _path: string
  private _connector?: BaseConnector
  manager: SourceManager

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
    this._path = path
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

  get path(): string {
    return this._path
  }

  // Testing purposes only
  setConnector(connector: BaseConnector) {
    this._connector = connector
  }

  get connectorPackageName(): string {
    return getConnectorPackage(this.type as ConnectorType)
  }

  async endConnection(): Promise<void> {
    if (!this._connector) return
    await this._connector.end()
    this._connector = undefined
  }

  async compileQuery(request: QueryRequest): Promise<CompiledQuery> {
    const connector = await this.connector()
    const compiledQuery = await connector.compileQuery(request)
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
}
