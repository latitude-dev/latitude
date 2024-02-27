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

  toJSON() {
    return JSON.stringify(
      {
        fields: this.fields,
        rows: this.rows,
        rowCount: this.rowCount,
      },
      (_, value) => {
        if (typeof value === 'bigint') {
          return value.toString()
        } else {
          return value
        }
      },
    )
  }

  toArray() {
    return this.rows.map((row: unknown[]) =>
      row.reduce((acc: Record<string, unknown>, value, i) => {
        acc[this.fields[i]!.name] = value
        return acc
      }, {} as { [key: string]: unknown }),
    )
  }
  
  static fromJSON(json: string) {
    const { fields, rows, rowCount } = JSON.parse(json)
    return new QueryResult({ fields, rows, rowCount })
  }
}
