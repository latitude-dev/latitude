import 'dotenv/config'
import * as fs from 'fs'
import path from 'path'
import yaml from 'yaml'

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
}

export class MissingEnvVarError extends Error {}

export function loadConfig({
  sourcePath,
}: {
  sourcePath: string
}): Record<string, unknown> {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source configuration file in: ${sourcePath}`)
  }

  const file = fs.readFileSync(sourcePath, 'utf8')
  const config = yaml.parse(file, (_, value) => {
    // if key starts with 'LATITUDE__', replace it with the environment variable
    if (typeof value === 'string' && value.startsWith('LATITUDE__')) {
      if (process.env[value]) return process.env[value]

      throw new MissingEnvVarError(`
      Invalid configuration. Environment variable ${value} was not found in the environment. You can review how to set up secret source credentials in the documentation: https://docs.latitude.so/sources/credentials
      `)
    } else {
      return value
    }
  })

  return config || {}
}

export class InvalidConnectorType extends Error {}

export function getConnectorPackage(type: ConnectorType) {
  switch (type) {
    case ConnectorType.Postgres:
      return '@latitude-data/postgresql-connector'
    case ConnectorType.Redshift:
      return '@latitude-data/postgresql-connector'
    case ConnectorType.Clickhouse:
      return '@latitude-data/clickhouse-connector'
    case ConnectorType.Bigquery:
      return '@latitude-data/bigquery-connector'
    case ConnectorType.Mysql:
      return '@latitude-data/mysql-connector'
    case ConnectorType.Snowflake:
      return '@latitude-data/snowflake-connector'
    case ConnectorType.Athena:
      return '@latitude-data/athena-connector'
    case ConnectorType.Trino:
      return '@latitude-data/trino-connector'
    case ConnectorType.Duckdb:
      return '@latitude-data/duckdb-connector'
    case ConnectorType.Sqlite:
      return '@latitude-data/sqlite-connector'
    case ConnectorType.Mssql:
      return '@latitude-data/mssql-connector'
    case ConnectorType.Databricks:
      return '@latitude-data/databricks-connector'
    default:
      throw new InvalidConnectorType(`Unsupported connector type: ${type}`)
  }
}

async function loadConnector(packageName: string) {
  try {
    const module = await import(/* @vite-ignore */ packageName)
    // Connector class MUST be the default export of the module
    const ConnectorClass = module.default

    if (
      typeof ConnectorClass === 'function' &&
      ConnectorClass.prototype.constructor
    ) {
      return { ConnectorClass }
    } else {
      return {
        errorMessage: `Module ${packageName} is not a valid Latitude connector. Please make sure you installed in your project npm install ${packageName}`,
      }
    }
  } catch (error) {
    const err = error as Error
    return { errorMessage: err.message }
  }
}

export async function createConnector(sourcePath: string) {
  const rootPath = path.dirname(sourcePath)
  const config = loadConfig({ sourcePath })
  const details = (config.details ?? {}) as object
  const packageName = getConnectorPackage(config.type as ConnectorType)
  const { ConnectorClass, errorMessage } = await loadConnector(packageName)

  if (!ConnectorClass) {
    throw new Error(errorMessage ?? 'unknown error')
  }

  return new ConnectorClass(rootPath, details)
}
