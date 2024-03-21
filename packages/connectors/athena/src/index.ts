import {
  AthenaClient,
  ColumnInfo,
  GetQueryExecutionCommand,
  GetQueryResultsCommand,
  Row,
  StartQueryExecutionCommand,
} from '@aws-sdk/client-athena'
import {
  BaseConnector,
  CompiledQuery,
  ConnectorError,
  ResolvedParam,
} from '@latitude-data/base-connector'
import QueryResult, { DataType, Field } from '@latitude-data/query_result'

interface AthenaQueryClientConfig {
  client: {
    region?: string
    credentials?: {
      accessKeyId: string
      secretAccessKey: string
    }
  }
  database: string
  catalog: string
  workgroup: string
  resultReuseConfiguration?: {
    ResultReuseByAgeConfiguration: {
      Enabled: boolean
      MaxAgeInMinutes?: number
    }
  }
}

export type ConnectionParams = AthenaQueryClientConfig

export class AthenaConnector extends BaseConnector {
  private client: AthenaClient
  private database: string = 'default'
  private catalog: string = 'AwsDataCatalog'
  private workgroup: string = 'primary'
  private resultReuseConfiguration = {
    ResultReuseByAgeConfiguration: {
      Enabled: false,
    },
  }

  constructor(rootPath: string, connectionParams: ConnectionParams) {
    super(rootPath)

    this.client = new AthenaClient(connectionParams.client)
    this.database = connectionParams.database || this.database
    this.catalog = connectionParams.catalog || this.catalog
    this.workgroup = connectionParams.workgroup || this.workgroup
    this.resultReuseConfiguration =
      connectionParams.resultReuseConfiguration || this.resultReuseConfiguration
  }

  resolve(value: unknown, _: number): ResolvedParam {
    return {
      value,
      resolvedAs: '?',
    }
  }

  async runQuery(query: CompiledQuery): Promise<QueryResult> {
    const queryExecutionInput = {
      QueryString: query.sql,
      ExecutionParameters: this.buildQueryParams(query.params),
      QueryExecutionContext: {
        Database: this.database,
        Catalog: this.catalog,
      },
      WorkGroup: this.workgroup,
      ResultReuseConfiguration: this.resultReuseConfiguration,
    }

    try {
      const { QueryExecutionId } = await this.client.send(
        new StartQueryExecutionCommand(queryExecutionInput),
      )

      const response = await this.checkQueryExequtionStateAndGetData(
        QueryExecutionId as string,
      )

      return response
    } catch (error) {
      throw new ConnectorError(`Query execution failed: ${error}`)
    }
  }

  private buildQueryParams(params: ResolvedParam[]) {
    const payload = params.map((param) => String(param.value))

    if (payload.length === 0) {
      return undefined
    } else {
      return payload
    }
  }

  private async checkQueryExequtionStateAndGetData(
    QueryExecutionId: string,
  ): Promise<QueryResult> {
    const command = new GetQueryExecutionCommand({ QueryExecutionId })
    try {
      const response = await this.client.send(command)
      const state = response?.QueryExecution?.Status?.State

      if (state === 'SUCCEEDED') {
        const { ResultSet } = await this.client.send(
          new GetQueryResultsCommand({ QueryExecutionId }),
        )

        const rowCount = ResultSet?.Rows?.length
        const rows = ResultSet?.Rows?.slice(1, -1).map(
          (row: Row) => row?.Data?.map((value) => value.VarCharValue) || [],
        )
        const fields = ResultSet?.ResultSetMetadata?.ColumnInfo?.map(
          (column: ColumnInfo) =>
            ({
              name: column.Name,
              type: this.convertDataType(column.Type),
            }) as Field,
        )

        return new QueryResult({ fields, rows, rowCount })
      } else if (state === 'FAILED') {
        throw new ConnectorError(
          `Query execution failed: ${response?.QueryExecution?.Status?.StateChangeReason}`,
        )
      } else {
        // We wait for 1 second before checking the query execution state again...
        await new Promise((resolve) => setTimeout(resolve, 1000))

        return this.checkQueryExequtionStateAndGetData(QueryExecutionId)
      }
    } catch (error) {
      throw new ConnectorError(`Query execution failed: ${error}`)
    }
  }

  private convertDataType(
    dataTypeID: string | undefined,
    fallbackDataType = DataType.Unknown,
  ): DataType {
    switch (dataTypeID) {
      case 'tinyint':
      case 'smallint':
      case 'int':
      case 'integer':
      case 'bigint':
        return DataType.Integer
      case 'real':
      case 'float':
      case 'double':
      case 'decimal':
      case 'numeric':
      case 'number':
        return DataType.Float
      case 'date':
      case 'timestamp':
        return DataType.Datetime
      case 'char':
      case 'varchar':
      case 'string':
        return DataType.String
      case 'boolean':
        return DataType.Boolean
      case 'binary':
      case 'varbinary':
      case 'ipaddress':
      case 'array':
      case 'map':
      case 'row':
      case 'struct':
      case 'udt':
      case 'uuid':
      default:
        return fallbackDataType
    }
  }
}
