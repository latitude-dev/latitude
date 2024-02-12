export enum DataType {
  Boolean = 'boolean',
  Integer = 'integer',
  Float = 'float',
  String = 'string',
  Datetime = 'datetime',
  Null = 'null',
  Unknown = 'unknown',
}

export type Field = {
  name: string
  dataType: DataType
}

export type QueryResult = {
  rowCount: number | null
  fields: Field[]
  payload: unknown[][]
}

export type QueryRequest = {
  sql: string
  params?: string[]
}

export abstract class BaseConnector {
  abstract query(request: QueryRequest): Promise<QueryResult>
}


export class ConnectorError extends Error {}
export class ConnectionError extends ConnectorError {}
export class QueryError extends ConnectorError {}