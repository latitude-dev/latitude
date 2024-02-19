import yaml from 'yaml'
import * as fs from 'fs'
import path from 'path'
import { type BaseConnector } from '@latitude-sdk/base-connector'
import { PostgresConnector } from '@latitude-sdk/postgresql-connector'
import { BigQueryConnector } from '@latitude-sdk/bigquery-connector'
import { MysqlConnector } from '@latitude-sdk/mysql-connector'
import { SnowflakeConnector } from '@latitude-sdk/snowflake-connector'
import { AthenaConnector } from '@latitude-sdk/athena-connector'

export enum ConnectorType {
  Athena = 'athena',
  Clickhouse = 'clickhouse',
  Postgres = 'postgres',
  Bigquery = 'bigquery',
  Mysql = 'mysql',
  Redshift = 'redshift',
  Snowflake = 'snowflake',
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
  if (!config?.details) throw new Error(`Missing 'details' in configuration`)
  if (typeof config.type !== 'string')
    throw new Error(`Invalid 'type' in configuration`)
  if (typeof config.details !== 'object' || Array.isArray(config.details))
    throw new Error(`Invalid 'details' in configuration`)

  const type = config.type
  const details = config.details

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
  }

  throw new Error()
}
