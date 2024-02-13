import { tableFromArrays } from 'apache-arrow'

enum DataType {
  Boolean = 'boolean',
  Datetime = 'datetime',
  Float = 'float',
  Integer = 'integer',
  Null = 'null',
  String = 'string',
  Unknown = 'unknown',
}

type Field = {
  name: string
  type: DataType
}

export default class QueryResult {
  fields: Field[] = []
  rowCount: number | null = 0
  rows: unknown[][] = []

  constructor(fields: Field[], rows: unknown[][], rowCount = rows.length) {
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
    JSON.stringify({
      fields: this.fields,
      rows: this.rows,
      rowCount: this.rowCount,
    })
  }
}
