import {
  BaseConnector,
  ConnectionError,
  CompiledQuery,
  ResolvedParam,
  QueryError,
} from '@latitude-data/base-connector'
import { readFileSync } from 'fs'
import { ClickHouseSettings, createClient } from '@clickhouse/client'
import QueryResult, { DataType, Field } from '@latitude-data/query_result'
import { NodeClickHouseClientConfigOptions } from '@clickhouse/client/dist/config'
import { NodeClickHouseClient } from '@clickhouse/client/dist/client'

export type TLSOptions = {
  ca_cert: string
  cert?: string
  key?: string
}

export type ConnectionParams = {
  url?: string
  pathname?: string
  request_timeout?: number
  username?: string
  password?: string
  database?: string
  clickhouse_settings?: ClickHouseSettings
  session_id?: string
  tls?: TLSOptions
}

export class ClickHouseConnector extends BaseConnector {
  private client: NodeClickHouseClient

  constructor(rootPath: string, connectionParams: ConnectionParams) {
    super(rootPath)

    try {
      this.client = createClient(this.buildConnectionParams(connectionParams))
    } catch (error) {
      throw new ConnectionError((error as Error).message)
    }
  }

  async end(): Promise<void> {
    await this.client.close()
  }

  resolve(value: unknown, id: number): ResolvedParam {
    return {
      value,
      resolvedAs: `{val_${id}:${this.getClickHouseDataType(value)}}`, // https://clickhouse.com/docs/en/interfaces/cli#cli-queries-with-parameters-syntax
    }
  }

  runQuery(query: CompiledQuery): Promise<QueryResult> {
    return new Promise((resolve, reject) => {
      this.client
        .query({
          query: query.sql,
          query_params: this.buildQueryParams(query.params),
          format: 'JSONCompact', // https://clickhouse.com/docs/en/interfaces/formats#jsoncompact
        })
        .then((resultSet) => resultSet.json())
        .then((result) => {
          resolve(
            new QueryResult({
              rowCount: result.rows,
              fields: result.meta?.map(
                (field) =>
                  ({
                    name: field.name,
                    type: this.convertDataType(field.type),
                  }) as Field,
              ),
              rows: result.data as unknown[][],
            }),
          )
        })
        .catch((error) => {
          reject(new QueryError(error.message))
        })
    })
  }

  private buildConnectionParams(
    params: ConnectionParams,
  ): NodeClickHouseClientConfigOptions {
    const tlsConfig = this.buildTLSConfig(params.tls)
    return {
      ...params,
      tls: tlsConfig,
    }
  }

  private buildTLSConfig(
    tls?: TLSOptions,
  ): NodeClickHouseClientConfigOptions['tls'] {
    if (!tls) return undefined
    const { ca_cert, key, cert } = tls
    return {
      ca_cert: this.readSecureFile(ca_cert),
      key: key ? this.readSecureFile(key) : undefined,
      cert: cert ? this.readSecureFile(cert) : undefined,
    }
  }

  private readSecureFile(filePath: string): Buffer {
    try {
      return readFileSync(filePath)
    } catch (error) {
      throw new Error(
        `Failed to read file at ${filePath}: ${(error as Error).message}`,
      )
    }
  }

  private buildQueryParams(params: ResolvedParam[]): Record<string, unknown> {
    return params.reduce((acc, { value, resolvedAs }) => {
      return {
        ...acc,
        [resolvedAs]: value,
      }
    }, {})
  }

  private getClickHouseDataType(value: unknown): string {
    if (typeof value === 'string') return 'String'
    if (typeof value === 'number') {
      if (Number.isInteger(value)) return 'Int256'
      return 'Float64'
    }
    if (typeof value === 'boolean') return 'Bool'
    if (value instanceof Date) return 'DateTime'
    if (Array.isArray(value)) {
      const type = value.length
        ? this.getClickHouseDataType(value[0])
        : 'String'
      return `Array(${type})`
    }
    if (value === null) return 'Nullable'
    if (typeof value === 'object') {
      const keyType = Object.keys(value).length
        ? this.getClickHouseDataType(Object.keys(value)[0])
        : 'String'
      const valueType = Object.values(value).length
        ? this.getClickHouseDataType(Object.values(value)[0])
        : 'String'
      return `Map(${keyType}, ${valueType})`
    }
    return 'String'
  }

  private convertDataType(
    dataTypeID: string,
    fallbackType = DataType.Unknown,
  ): DataType {
    // https://clickhouse.com/docs/en/sql-reference/data-types
    if (dataTypeID.startsWith('UInt') || dataTypeID.startsWith('Int')) {
      return DataType.Integer
    }
    if (dataTypeID.startsWith('Float') || dataTypeID.startsWith('Decimal')) {
      return DataType.Float
    }
    if (dataTypeID in ['Bool', 'Boolean']) {
      return DataType.Boolean
    }
    if (dataTypeID == 'String' || dataTypeID.startsWith('FixedString')) {
      return DataType.String
    }
    if (dataTypeID in ['Date', 'Date32', 'DateTime', 'DateTime64']) {
      return DataType.Datetime
    }

    const nullableMatch = dataTypeID.match(/Nullable\((.*)\)/)
    if (nullableMatch && nullableMatch.length > 1) {
      return this.convertDataType(nullableMatch[1]!)
    }

    if (
      dataTypeID in ['JSON', 'UUID', 'IPv4', 'IPv6', 'Enum8', 'Enum16', 'Enum']
    ) {
      return DataType.String
    }

    return fallbackType
  }
}
