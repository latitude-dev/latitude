import 'dotenv/config'
import type {
  CompiledQuery,
  QueryConfig,
  QueryRequest,
  BaseConnector,
} from '@latitude-data/base-connector'
import createConnector, {
  ConnectorType,
  getConnectorPackage,
} from './lib/createConnector'
import path from 'path'
import { SourceSchema } from './types'
import type QueryResult from '@latitude-data/query_result'

export class Source {
  private _schema: SourceSchema
  private _path: string
  private _connector?: BaseConnector

  constructor(path: string, config: any) {
    this._path = path
    this._schema = config
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

  get connectorPackageName(): string {
    return getConnectorPackage(this.type as ConnectorType)
  }

  private async connector(): Promise<BaseConnector> {
    if (!this._connector) {
      this._connector = await createConnector(
        path.dirname(this.path),
        this.type as ConnectorType,
        this._schema.details ?? {},
      )
    }

    return this._connector
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
}
