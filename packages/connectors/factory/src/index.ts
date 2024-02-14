import yaml from 'yaml'
import fs from 'fs'
import path from 'path'
import { type BaseConnector } from '@latitude-sdk/base-connector'
import { PostgresConnector } from '@latitude-sdk/postgresql-connector'

export enum ConnectorType {
  Postgres = 'postgres',
}

export function createConnector(sourcePath: string): BaseConnector {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source configuration file in: ${sourcePath}`)
  }

  const file = fs.readFileSync(sourcePath, 'utf8')
  const config = yaml.parse(file)

  if (!config?.type) throw new Error(`Missing 'type' in configuration`)
  if (!config?.details) throw new Error(`Missing 'details' in configuration`)
  if (typeof config.type !== 'string')
    throw new Error(`Invalid 'type' in configuration`)
  if (typeof config.details !== 'object' || Array.isArray(config.details))
    throw new Error(`Invalid 'details' in configuration`)

  const type = config.type
  const details = config.details

  if (!Object.values(ConnectorType).includes(type)) {
    throw new Error('Unsupported connector type: ${config.type}')
  }

  switch (type) {
    case ConnectorType.Postgres:
      return new PostgresConnector(path.dirname(sourcePath), details)
  }

  throw new Error()
}
