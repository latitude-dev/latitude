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
export type CompiledQuery = {
  sql: string
  params: ResolvedParam[]
}

export class ConnectorError extends Error { }
export class ConnectionError extends ConnectorError { }
export class QueryError extends ConnectorError { }
