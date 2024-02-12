import yaml from 'yaml';
import fs from 'fs';
import path from 'path';
import { type BaseConnector } from '@latitude-dev/base-connector';
import { PostgresConnector } from '@latitude-dev/postgresql-connector';

export enum ConnectorType {
  Postgres = 'postgres',
}

export function createConnector(sourcePath: string): BaseConnector {
  const fullPath = path.join(sourcePath, 'source.yml');
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing sources.yml file in: ${fullPath}`);
  }
  const file = fs.readFileSync(fullPath, 'utf8');
  const config = yaml.parse(file);

  if (!config?.type) throw new Error(`Missing 'type' in configuration`);
  if (!config?.details) throw new Error(`Missing 'details' in configuration`);
  if (typeof config.type !== 'string') throw new Error(`Invalid 'type' in configuration`);
  if (typeof config.details !== 'object' || Array.isArray(config.details)) throw new Error(`Invalid 'details' in configuration`);

  const type = config.type
  const details = config.details

  if (!Object.values(ConnectorType).includes(type)) {
    throw new Error("Unsupported connector type: ${config.type}")
  }

  switch (type) {
    case ConnectorType.Postgres:
      return new PostgresConnector(sourcePath, details);
  }

  throw new Error()
}