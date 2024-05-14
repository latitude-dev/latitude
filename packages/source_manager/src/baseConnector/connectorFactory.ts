import {
  BaseConnector,
  ConnectorAttributes,
  ConnectorOptions,
} from '@/baseConnector'
import { ConnectorType } from '@/types'
import TestConnector from '@/testConnector'

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

class ConnectorNotInstalledError extends Error {
  constructor(pkgName: string) {
    const message = `Module ${pkgName} is not a valid Latitude connector. Please make sure you have the correct package installed in your project by running 'npm install ${pkgName}'`
    super(message)
  }
}
class ConnectorWithoutDefaultExportError extends Error {
  constructor(pkgName: string) {
    const message = `Module ${pkgName} does not have a default export.`
    super(message)
  }
}

async function importConnector(
  packageName: string,
): Promise<
  new (_args: ConnectorOptions<ConnectorAttributes>) => BaseConnector
> {
  try {
    const module = await import(/* @vite-ignore */ packageName)
    const ConnectorClass = module.default

    if (
      typeof ConnectorClass === 'function' &&
      ConnectorClass.prototype.constructor
    ) {
      return ConnectorClass
    } else {
      throw new ConnectorWithoutDefaultExportError(packageName)
    }
  } catch (error) {
    if (error instanceof ConnectorWithoutDefaultExportError) {
      throw error
    }
    throw new ConnectorNotInstalledError(packageName)
  }
}

export class InvalidConnectorType extends Error {}

export function getConnectorPackage(type: ConnectorType) {
  if (type === ConnectorType.TestInternal) return null

  if (!(type in CONNECTOR_PACKAGES)) {
    throw new InvalidConnectorType(`Unsupported connector type: ${type}`)
  }
  const pkgName = CONNECTOR_PACKAGES[type]

  return `@latitude-data/${pkgName}`
}

export default async function createConnectorFactory({
  type,
  connectorOptions,
}: {
  type: ConnectorType
  connectorOptions: ConnectorOptions<ConnectorAttributes>
}): Promise<BaseConnector> {
  const packageName = getConnectorPackage(type)
  const ConnectorClass = !packageName
    ? TestConnector // If no package is found, use the test connector
    : await importConnector(packageName)

  return new ConnectorClass(connectorOptions)
}
