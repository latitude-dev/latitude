import 'dotenv/config'
import * as fs from 'fs'
import path from 'path'
import yaml from 'yaml'
import { AthenaConnector } from '@latitude-data/athena-connector'
import { BigQueryConnector } from '@latitude-data/bigquery-connector'
import { DatabricksConnector } from '@latitude-data/databricks-connector'
import { DuckdbConnector } from '@latitude-data/duckdb-connector'
import { MssqlConnector } from '@latitude-data/mssql-connector'
import { MysqlConnector } from '@latitude-data/mysql-connector'
import { PostgresConnector } from '@latitude-data/postgresql-connector'
import { SnowflakeConnector } from '@latitude-data/snowflake-connector'
import { SqliteConnector } from '@latitude-data/sqlite-connector'
import { TrinoConnector } from '@latitude-data/trino-connector'

import { type BaseConnector } from '@latitude-data/base-connector'

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

export function createConnector(sourcePath: string): BaseConnector {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source configuration file in: ${sourcePath}`)
  }

  const file = fs.readFileSync(sourcePath, 'utf8')
  const config = yaml.parse(file, (_, value) => {
    // if key starts with 'LATITUDE__', replace it with the environment variable
    if (typeof value === 'string' && value.startsWith('LATITUDE__')) {
      return process.env[value] || value
    } else {
      return value
    }
  })

  if (!config?.type) throw new Error(`Missing 'type' in configuration`)
  if (typeof config.type !== 'string')
    throw new Error(`Invalid 'type' in configuration`)

  const type = config.type
  const details = config.details || {}

  if (!Object.values(ConnectorType).includes(type)) {
    throw new Error(`Unsupported connector type: ${config.type}`)
  }

  switch (type) {
    case ConnectorType.Postgres:
    case ConnectorType.Redshift:
    case ConnectorType.Clickhouse:
      return new PostgresConnector(path.dirname(sourcePath), details)
    case ConnectorType.Bigquery:
      return new BigQueryConnector(path.dirname(sourcePath), details)
    case ConnectorType.Mysql:
      return new MysqlConnector(path.dirname(sourcePath), details)
    case ConnectorType.Snowflake:
      return new SnowflakeConnector(path.dirname(sourcePath), details)
    case ConnectorType.Athena:
      return new AthenaConnector(path.dirname(sourcePath), details)
    case ConnectorType.Trino:
      return new TrinoConnector(path.dirname(sourcePath), details)
    case ConnectorType.Duckdb:
      return new DuckdbConnector(path.dirname(sourcePath), details)
    case ConnectorType.Sqlite:
      return new SqliteConnector(path.dirname(sourcePath), details)
    case ConnectorType.Mssql:
      return new MssqlConnector(path.dirname(sourcePath), details)
    case ConnectorType.Databricks:
      return new DatabricksConnector(path.dirname(sourcePath), details)
  }

  throw new Error()
}
