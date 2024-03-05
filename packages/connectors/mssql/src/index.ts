import {
  BaseConnector,
  CompiledQuery,
  ResolvedParam,
} from '@latitude-data/base-connector'
import QueryResult, { DataType, Field } from '@latitude-data/query_result'
import sql from 'mssql'

export type ConnectionParams = {
  user: string
  password: string
  database: string
  server: string
  pool?: {
    max: number
    min: number
    idleTimeoutMillis: number
  }
  options?: {
    encrypt: boolean
    trustServerCertificate: boolean
  }
}

export class MssqlConnector extends BaseConnector {
  private pool

  constructor(rootPath: string, connectionParams: ConnectionParams) {
    super(rootPath)

    this.pool = new sql.ConnectionPool(connectionParams)
  }

  resolve(value: unknown, index: number): ResolvedParam {
    return {
      value,
      resolvedAs: `@var${index + 1}`,
    }
  }

  async runQuery(query: CompiledQuery): Promise<QueryResult> {
    let fields: Field[] = []
    const rows: unknown[][] = []
    const conn = await this.pool.connect()

    if (query.params.length > 0) {
      const ps = new sql.PreparedStatement(conn)

      for (const param of query.params) {
        ps.input(
          param.resolvedAs.replace('@', ''),
          this.inferDataType(param.value),
        )
      }

      return await new Promise((resolve, reject) => {
        ps.prepare(query.sql, (err) => {
          if (err) {
            return reject(err)
          }

          const pp = this.buildQueryParams(query.params)
          ps.stream = true
          const req = ps.execute(pp, (err) => {
            if (err) {
              reject(err)
            }
          })
          req.on('done', () => {
            ps.unprepare((err) => {
              if (err) {
                return reject(err)
              }

              resolve(
                new QueryResult({
                  fields,
                  rows,
                  rowCount: rows.length,
                }),
              )
            })
          })

          req.on('recordset', (columns) => {
            fields = this.buildFields(columns)
          })

          req.on('error', (err: Error) => {
            reject(err)
          })

          req.on('row', (row: unknown[]) => {
            rows.push(row)
          })
        })
      })
    } else {
      const request = new sql.Request(conn)
      request.stream = true
      request.query(query.sql)

      return await new Promise((resolve, reject) => {
        request.on('done', async () => {
          resolve(
            new QueryResult({
              fields,
              rows,
              rowCount: rows.length,
            }),
          )
        })

        request.on('recordset', (columns) => {
          fields = this.buildFields(columns)
        })

        request.on('error', (err) => {
          reject(err)
        })

        request.on('row', (row) => {
          rows.push(row)
        })
      })
    }
  }

  private buildQueryParams(params: ResolvedParam[]) {
    return params.reduce((acc, param) => {
      return {
        ...acc,
        [param.resolvedAs.replace('@', '')]: param.value,
      }
    }, {})
  }

  private buildFields(columns: sql.IColumnMetadata) {
    return Object.entries(columns).map(([name, column]) => {
      return {
        name,
        type: this.convertDataType(column.type),
      } as Field
    })
  }

  private convertDataType(
    type: sql.ISqlTypeFactory,
    fallback = DataType.Unknown,
  ) {
    switch (type) {
      case sql.Bit:
        return DataType.Boolean
      case sql.TinyInt:
      case sql.SmallInt:
      case sql.Int:
      case sql.BigInt:
        return DataType.Integer
      case sql.Decimal:
      case sql.Float:
      case sql.Money:
      case sql.Numeric:
      case sql.SmallMoney:
      case sql.Real:
        return DataType.Float
      case sql.Char:
      case sql.NChar:
      case sql.Text:
      case sql.NText:
      case sql.VarChar:
      case sql.NVarChar:
        return DataType.String
      case sql.Time:
      case sql.Date:
      case sql.DateTime:
      case sql.DateTime2:
      case sql.DateTimeOffset:
      case sql.SmallDateTime:
        return DataType.Datetime
      default:
        return fallback
    }
  }

  private inferDataType(value: unknown) {
    // IMPORTANT: Order matters
    if (typeof value === 'boolean') {
      return sql.Bit
    } else if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        return sql.Int
      } else {
        return sql.Float
      }
    } else if (value instanceof Date) {
      return sql.DateTime
    } else if (!isNaN(Date.parse(value as string))) {
      return sql.DateTime
    } else {
      return sql.VarChar
    }
  }
}
