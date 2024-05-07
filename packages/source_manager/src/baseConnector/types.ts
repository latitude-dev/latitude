export type QueryParams = {
  [key: string]: unknown
}

export type QueryRequest = {
  queryPath: string
  params?: QueryParams
}

export type QueryConfig = {
  ttl?: number
}

export type ResolvedParam = {
  value: unknown
  resolvedAs: string
}

export type CompiledQuery = {
  sql: string
  resolvedParams: ResolvedParam[]
  accessedParams: QueryParams
  config: QueryConfig
}

export class ConnectorError extends Error {}
export class ConnectionError extends ConnectorError {}
export class QueryError extends ConnectorError {}
