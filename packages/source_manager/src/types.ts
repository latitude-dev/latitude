import { Field, QueryResultArray } from '@latitude-data/query_result'
import { Source } from './source'
export { CompileError } from '@latitude-data/sql-compiler'

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
}

export type QueryConfig = {
  ttl?: number
  materialize?: boolean
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
  source: Source
  context: CompilationContext
}

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

export type BatchedRow = Record<string, unknown>
export type BatchResponse = {
  rows: BatchedRow[]
  fields: Field[]
  lastBatch: boolean
}
export type BatchedQueryOptions = {
  batchSize: number
  onBatch: (_r: BatchResponse) => Promise<void>
}

interface IMaterializationInfo {
  queryPath: string
  cached: boolean
}

interface CachedMaterializationInfo extends IMaterializationInfo {
  cached: true
  url: string
}

interface IMissMaterializationInfo extends IMaterializationInfo {
  cached: false
  success: boolean
}

interface SuccessMaterializationInfo extends IMissMaterializationInfo {
  cached: false
  success: true
  url: string
  rows: number
  fileSize: number
  time: number
}

export interface FailedMaterializationInfo extends IMissMaterializationInfo {
  cached: false
  success: false
  error: Error
}

export type MaterializationInfo =
  | CachedMaterializationInfo
  | SuccessMaterializationInfo
  | FailedMaterializationInfo
