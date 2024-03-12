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

type Props = {
  fields?: Field[]
  rows?: unknown[][]
  rowCount?: number
}

export type QueryResultPayload = {
  fields: Field[]
  rows: unknown[][]
  rowCount: number
}

export type QueryResultRow = { [key: string]: unknown }
export type QueryResultArray = {
  [key: string]: unknown
}[]

export default class QueryResult {
  fields: Field[]
  rowCount: number
  rows: unknown[][]

  static fromJSON(json: string) {
    const { fields, rows, rowCount } = JSON.parse(json)
    return new QueryResult({
      fields,
      rows,
      rowCount,
    })
  }

  constructor({ fields = [], rowCount = 0, rows = [] }: Props) {
    this.fields = fields
    this.rowCount = rowCount
    this.rows = rows
  }

  serialize() {
    return {
      fields: this.fields,
      rowCount: this.rowCount,
      rows: this.rows,
    }
  }

  toJSON() {
    const { fields, rows, rowCount } = this.serialize()
    return JSON.stringify({
      fields,
      rows: rows.map((row) => {
        return row.map((value) => {
          if (typeof value === 'bigint') {
            return Number(value)
          } else {
            return value
          }
        })
      }),
      rowCount,
    })
  }

  toArray() {
    return this.rows.map((row: unknown[]) =>
      row.reduce((acc: Record<string, unknown>, value, i) => {
        acc[this.fields[i]!.name] = value
        return acc
      }, {} as QueryResultRow),
    )
  }
}
