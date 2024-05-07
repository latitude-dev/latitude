import { BigQuery, BigQueryOptions } from '@google-cloud/bigquery'
import {
  BaseConnector,
  ConnectionError,
  CompiledQuery,
  ResolvedParam,
  ConnectorError,
  ConnectorOptions,
} from '@latitude-data/source-manager'
import QueryResult, { DataType, Field } from '@latitude-data/query_result'
import { OAuth2Client } from 'google-auth-library'
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth'

type ConnectionParams = {
  credentials?: {
    client_email: string
    private_key: string
  }
  projectId: string
  token?: string
}

export default class BigQueryConnector extends BaseConnector<ConnectionParams> {
  private params: ConnectionParams

  constructor(options: ConnectorOptions<ConnectionParams>) {
    super(options)

    this.params = options.connectionParams
  }

  resolve(value: unknown, index: number): ResolvedParam {
    return {
      value,
      resolvedAs: `@var${index + 1}`,
    }
  }

  async runQuery(compiledQuery: CompiledQuery): Promise<QueryResult> {
    const client = this.createClient()

    try {
      const [job] = await client.createQueryJob({
        query: compiledQuery.sql,
        params: this.buildQueryParams(compiledQuery.resolvedParams),
      })

      // Wait for the query to finish
      const [rows, , metadata] = await job.getQueryResults({
        autoPaginate: false,
      })
      const rowCount = Number(metadata?.totalRows) || 0
      const fields =
        metadata?.schema?.fields?.map(
          (field) =>
            ({
              name: field.name,
              type: this.convertDataType(field.type),
            }) as Field,
        ) || []

      return new QueryResult({
        rowCount,
        fields,
        rows: this.transformRows({ rows, fields }),
      })
    } catch (error) {
      throw new ConnectorError((error as Error).message)
    }
  }

  private buildCredentials(): BigQueryOptions {
    const credentials = { projectId: this.params.projectId }

    if (this.params.credentials) {
      return {
        ...credentials,
        credentials: {
          client_email: this.params.credentials.client_email,
          private_key: this.params.credentials.private_key
            .replace(/\\n/g, '\n')
            .trim(),
        },
      }
    } else if (this.params.token) {
      const { token } = this.params
      const oauth = new OAuth2Client()
      oauth.setCredentials({ access_token: token })

      return {
        ...credentials,
        authClient: oauth as JSONClient,
      }
    } else {
      return credentials
    }
  }

  private buildQueryParams(params: ResolvedParam[]): Record<string, unknown> {
    return params.reduce(
      (acc, param, index) => {
        acc[`var${index + 1}`] = param.value
        return acc
      },
      {} as Record<string, unknown>,
    )
  }

  private createClient() {
    try {
      return new BigQuery(this.buildCredentials())
    } catch (error: unknown) {
      const errorObj = error as Error
      throw new ConnectionError(errorObj.message, errorObj)
    }
  }

  private transformRows({
    rows,
    fields,
  }: {
    rows: Record<string, unknown>[]
    fields: Field[]
  }) {
    return rows.map((row) => {
      return Object.entries(row).map(([key, value]) => {
        const field = fields.find((field) => field.name === key)
        if (!field) return value

        if (field.type === DataType.Datetime) {
          return (value as { value: unknown })['value']
        } else {
          return value
        }
      })
    })
  }

  private convertDataType(
    dataTypeID: string | undefined,
    fallbackType = DataType.Unknown,
  ): DataType {
    switch (dataTypeID) {
      case 'BOOL':
      case 'BOOLEAN':
        return DataType.Boolean
      case 'INT64':
      case 'INT':
      case 'SMALLINT':
      case 'INTEGER':
      case 'BIGINT':
      case 'TINYINT':
      case 'BYTEINT':
      case 'NUMERIC':
      case 'BIGNUMERIC':
        return DataType.Integer
      case 'BIGDECIMAL':
      case 'DECIMAL':
      case 'FLOAT64':
      case 'FLOAT':
        return DataType.Float
      case 'TIME':
      case 'STRING':
      case 'BYTES':
      case 'GEOGRAPHY':
      case 'INTERVAL':
        return DataType.String
      case 'TIMESTAMP':
      case 'DATE':
      case 'DATETIME':
        return DataType.Datetime
      case 'STRUCT':
      case 'ARRAY':
      case 'JSON':
      default:
        return fallbackType
    }
  }
}
