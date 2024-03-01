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
export type Props = {
  fields?: Field[]
  rows?: unknown[][]
  rowCount?: number
}

export type QueryResultArray = {
  [key: string]: unknown
}[]

export default class QueryResult {
  fields: Field[]
  rowCount: number
  rows: unknown[][]

  constructor({ fields = [], rowCount = 0, rows = [] }: Props) {
    this.fields = fields
    this.rowCount = rowCount
    this.rows = rows
  }

  payload() {
    return {
      fields: this.fields,
      rows: this.rows.map((row) => {
        return row.map((value) => {
          if (typeof value === 'bigint') {
            return value.toString()
          } else {
            return value
          }
        })
      }),
      rowCount: this.rowCount,
    }
  }

  toArray() {
    return this.rows.map((row: unknown[]) =>
      row.reduce(
        (acc: Record<string, unknown>, value, i) => {
          acc[this.fields[i]!.name] = value
          return acc
        },
        {} as { [key: string]: unknown },
      ),
    )
  }
}
