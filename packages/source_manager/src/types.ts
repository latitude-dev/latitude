import { QueryResultArray } from '@latitude-data/query_result'
import { type SupportedMethod } from '@latitude-data/sql-compiler'
export { CompileError } from '@latitude-data/sql-compiler'

export type { GetUrlParams } from './materialize/drivers/StorageDriver'

export enum ConnectorType {
  Athena = 'athena',
  Clickhouse = 'clickhouse',
  Duckdb = 'duckdb',
  Postgres = 'postgres',
  Bigquery = 'bigquery',
  Mysql = 'mysql',
  Redshift = 'redshift',
  Snowflake = 'snowflake',
  Trino = 'trino',
  Sqlite = 'sqlite',
  Mssql = 'mssql',
  Databricks = 'databricks',
  Test = 'test', // Used for testing purposes
  TestInternal = 'internal_test', // Used for testing inside this package purposes
  Materialized = 'materialized',
}

export type QueryConfig = {
  ttl?: number
}

export type QueryParams = {
  [key: string]: unknown
}

export type QueryRequest = {
  queryPath: string
  params?: QueryParams
}
export type ResolvedParam = {
  value: unknown
  resolvedAs: string
}
export type CompileQueryRequest = QueryRequest & { sql: string }
export type RanQueries = Record<string, QueryResultArray>
export type CompilationContext = {
  // Requested query
  request: CompileQueryRequest
  // Parameters used in the query
  accessedParams: QueryParams
  // Parameters resolved by the connector, in order of appearance
  resolvedParams: ResolvedParam[]
  // Cache of already ran queries
  ranQueries: RanQueries
  // Used to detect cyclic references
  queriesBeingCompiled: string[]
}

export type BuildSupportedMethodsArgs = {
  context: CompilationContext
  resolveFn: (value: unknown) => Promise<string>
}
export type SupportedMethodsResponse = Record<string, SupportedMethod>

export type CompiledQuery = {
  sql: string
  resolvedParams: ResolvedParam[]
  accessedParams: QueryParams
}

export class ConnectorError extends Error {}
export class ConnectionError extends ConnectorError {}
export class QueryError extends ConnectorError {}

export class NotFoundError extends Error {}

export class QueryNotFoundError extends NotFoundError {}
export class SourceFileNotFoundError extends NotFoundError {}

export interface SourceSchema {
  type: ConnectorType
  details?: Record<string, unknown>
  config?: QueryConfig
}
