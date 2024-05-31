import { Field, QueryResultArray } from '@latitude-data/query_result'
import { Source } from './source'
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

// Parquet logical types
// https://github.com/LibertyDSNP/parquetjs?tab=readme-ov-file#list-of-supported-types--encodings
export enum ParquetLogicalType {
  BOOLEAN = 'BOOLEAN',
  INT32 = 'INT32',
  INT64 = 'INT64',
  INT96 = 'INT96',
  FLOAT = 'FLOAT',
  DOUBLE = 'DOUBLE',
  BYTE_ARRAY = 'BYTE_ARRAY',
  FIXED_LEN_BYTE_ARRAY = 'FIXED_LEN_BYTE_ARRAY',
  UTF8 = 'UTF8',
  ENUM = 'ENUM',
  DATE = 'DATE',
  TIME_MILLIS = 'TIME_MILLIS',
  TIMESTAMP_MILLIS = 'TIMESTAMP_MILLIS',
  TIMESTAMP_MICROS = 'TIMESTAMP_MICROS',
  TIME_MICROS = 'TIME_MICROS',
  UINT_8 = 'UINT_8',
  UINT_16 = 'UINT_16',
  UINT_32 = 'UINT_32',
  UINT_64 = 'UINT_64',
  INT_8 = 'INT_8',
  INT_16 = 'INT_16',
  INT_32 = 'INT_32',
  INT_64 = 'INT_64',
  JSON = 'JSON',
  BSON = 'BSON',
  INTERVAL = 'INTERVAL',
}
