import {
  BaseConnector,
  CompiledQuery,
  ConnectionError,
  ResolvedParam,
} from '@latitude-data/base-connector'
import QueryResult, { DataType, Field } from '@latitude-data/query_result'
import { DBSQLClient } from '@databricks/sql'
import { ConnectionOptions } from '@databricks/sql/dist/contracts/IDBSQLClient'
import { TTypeDesc } from '@databricks/sql/thrift/TCLIService_types'

export type ConnectionParams = {
  host: string
  port?: number
  path: string
  clientId?: string

  token?: string

  oauthClientId?: string
  oauthClientSecret?: string
}

export default class DatabricksConnector extends BaseConnector {
  private client: DBSQLClient

  constructor(rootPath: string, connectionParams: ConnectionParams) {
    super(rootPath)
    this.client = new DBSQLClient()
    const { host, port, path } = connectionParams
    const connection = { host, port, path }

    let connectionOptions: ConnectionOptions
    if (connectionParams.token) {
      connectionOptions = {
        ...connection,
        authType: 'access-token',
        token: connectionParams.token,
      }
    } else if (
      connectionParams.oauthClientId &&
      connectionParams.oauthClientSecret
    ) {
      connectionOptions = {
        ...connection,
        authType: 'databricks-oauth',
        oauthClientId: connectionParams.oauthClientId,
        oauthClientSecret: connectionParams.oauthClientSecret,
      }
    } else {
      throw new ConnectionError(
        'Invalid connection parameters. Provide either a token or OAuth client ID and secret.',
      )
    }

    this.client.connect(connectionOptions)
  }

  end(): Promise<void> {
    return this.client.close()
  }

  resolve(value: unknown, index: number): ResolvedParam {
    /**
     * Databricks parameterisation is done using {{ var_name }} for regular variables
     * and '{{ var_name }}' for date and timestamp values.
     * https://docs.databricks.com/en/sql/user/queries/query-parameters.html#date-and-time
     */
    const isDate =
      value instanceof Date ||
      (typeof value === 'string' && !isNaN(Date.parse(value)))
    const resolvedValue = `{{ var_${index} }}`
    return {
      value,
      resolvedAs: isDate ? `'${resolvedValue}'` : resolvedValue,
    }
  }

  async runQuery(request: CompiledQuery): Promise<QueryResult> {
    const session = await this.client.openSession()
    const queryOperation = await session.executeStatement(request.sql, {
      namedParameters: request.params.reduce((acc, param, index) => {
        return { ...acc, [`var_${index}`]: param.value }
      }),
    })
    const result = await queryOperation.fetchAll()
    const schema = await queryOperation.getSchema()
    await queryOperation.close()
    await session.close()

    const fields: Field[] = schema!.columns.map((column) => {
      return {
        name: column.columnName,
        type: this.convertDataType(column.typeDesc),
      }
    })
    const rows: unknown[][] = result.map((row) => Object.values(row))

    return new QueryResult({
      rowCount: rows.length,
      fields,
      rows,
    })
  }

  private convertDataType(
    dataType: TTypeDesc,
    fallbackType = DataType.Unknown,
  ): DataType {
    switch (dataType.types[0]?.primitiveEntry?.type) {
      case 0: // BOOLEAN_TYPE
      case 1: // TINYINT_TYPE
        return DataType.Boolean
      case 2: // SMALLINT_TYPE
      case 3: // INT_TYPE
      case 4: // BIGINT_TYPE
        return DataType.Integer
      case 5: // FLOAT_TYPE
      case 6: // DOUBLE_TYPE
      case 15: // DECIMAL_TYPE
        return DataType.Float
      case 7: // STRING_TYPE
      case 18: // VARCHAR_TYPE
      case 19: // CHAR_TYPE
        return DataType.String
      case 8: // TIMESTAMP_TYPE
      case 17: // DATE_TYPE
        return DataType.Datetime
      default:
        return fallbackType
    }
  }
}
