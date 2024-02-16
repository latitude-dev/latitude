import { tableFromArrays } from 'apache-arrow'

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

export default class QueryResult {
  fields: Field[] = []
  rowCount: number = 0
  rows: unknown[][] = []

  constructor({
    fields = [],
    rowCount = 0,
    rows = [],
  }: {
    fields?: Field[]
    rowCount?: number
    rows?: unknown[][]
  }) {
    this.fields = fields
    this.rows = rows
    this.rowCount = rowCount
  }

  toArrowTable() {
    return tableFromArrays(
      this.fields.reduce(
        (acc, field, i) => {
          acc[field.name] = this.rows.map((row) => row[i])
          return acc
        },
        {} as { [key: string]: unknown[] },
      ),
    )
  }

  toJSON() {
    return JSON.stringify({
      fields: this.fields,
      rows: this.rows,
      rowCount: this.rowCount,
    })
  }
}
