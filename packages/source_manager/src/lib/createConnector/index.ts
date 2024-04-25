import { BaseConnector } from '@latitude-data/base-connector'

export enum ConnectorType {
  Athena = 'athena',
  Clickhouse = 'clickhouse',
  Duckdb = 'duckdb',
  Postgres = 'postgres',
  Bigquery = 'bigquery',
  Mysql = 'mysql',
  Redshift = 'redshift',
  Snowflake = 'snowflake',
  Trino = 'trino',
  Sqlite = 'sqlite',
  Mssql = 'mssql',
  Databricks = 'databricks',
  Test = 'test', // Used for testing purposes
}

const CONNECTOR_PACKAGES = {
  [ConnectorType.Postgres]: 'postgresql-connector',
  [ConnectorType.Redshift]: 'postgresql-connector',
  [ConnectorType.Clickhouse]: 'clickhouse-connector',
  [ConnectorType.Bigquery]: 'bigquery-connector',
  [ConnectorType.Mysql]: 'mysql-connector',
  [ConnectorType.Snowflake]: 'snowflake-connector',
  [ConnectorType.Athena]: 'athena-connector',
  [ConnectorType.Trino]: 'trino-connector',
  [ConnectorType.Duckdb]: 'duckdb-connector',
  [ConnectorType.Sqlite]: 'sqlite-connector',
  [ConnectorType.Mssql]: 'mssql-connector',
  [ConnectorType.Databricks]: 'databricks-connector',
  [ConnectorType.Test]: 'test-connector',
}

export class InvalidConnectorType extends Error {}

export function getConnectorPackage(type: ConnectorType) {
  if (!(type in CONNECTOR_PACKAGES)) {
    throw new InvalidConnectorType(`Unsupported connector type: ${type}`)
  }

  return `@latitude-data/${CONNECTOR_PACKAGES[type]}`
}

async function loadConnector(
  packageName: string,
): Promise<new (rootPath: string, details: object) => BaseConnector> {
  const module = await import(/* @vite-ignore */ packageName)
  // Connector class MUST be the default export of the module
  const ConnectorClass = module.default

  if (
    typeof ConnectorClass === 'function' &&
    ConnectorClass.prototype.constructor
  ) {
    return ConnectorClass
  } else {
    throw new Error(
      `Module ${packageName} is not a valid Latitude connector. Please make sure you have the correct package installed in your project by running 'npm install ${packageName}'`,
    )
  }
}

export default async function createConnector(
  rootPath: string,
  type: ConnectorType,
  connectionDetails: object,
): Promise<BaseConnector> {
  const packageName = getConnectorPackage(type)
  const ConnectorClass = await loadConnector(packageName)
  return new ConnectorClass(rootPath, connectionDetails)
}
