import { compile } from "./compile"

export enum DataType {
  Boolean = 'boolean',
  Datetime = 'datetime',
  Float = 'float',
  Integer = 'integer',
  Null = 'null',
  String = 'string',
  Unknown = 'unknown',
}

export type Field = {
  name: string
  type: DataType
}

export type QueryResult = {
  rowCount: number | null
  fields: Field[]
  rows: unknown[][]
}

export type QueryParams = {
  [key: string]: unknown
}

export type QueryRequest = {
  sql: string
  params?: QueryParams
}

export abstract class BaseAdapter {
  abstract resolve(varName: string, value: unknown): string
  abstract getParams(): QueryParams

  public compile(sql: string, params?: QueryParams): { sql: string, params: QueryParams } {
    return {
      sql: compile(this, sql, params),
      params: this.getParams(),
    }
  }
}

export abstract class BaseConnector {
  abstract adapter(): BaseAdapter
  abstract runQuery(request: QueryRequest): Promise<QueryResult>

  async query(request: QueryRequest): Promise<QueryResult> {
    const adapter = this.adapter()
    const { sql, params } = adapter.compile(request.sql, request.params)
    return this.runQuery({ sql, params })
  }
}

export class ConnectorError extends Error {}
export class ConnectionError extends ConnectorError {}
export class QueryError extends ConnectorError {}
