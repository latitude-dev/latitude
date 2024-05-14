import MaterializedConnector, { type ConnectionParams } from '$/index'
import {
  ConnectorType,
  Source,
  SourceManager,
  type SourceSchema,
} from '@latitude-data/source-manager'

export const QUERIES_DIR = 'static/.latitude/queries'

export async function buildMaterializedConnector({
  connectionParams,
  sourceParams,
  queriesDir,
}: {
  connectionParams?: ConnectionParams
  sourceParams: {
    path: string
    schema?: Omit<SourceSchema, 'type'>
  }
  queriesDir?: string
}) {
  const connParams = connectionParams ?? {}
  const sourceSchema = sourceParams.schema ?? {}
  const sourceManager = new SourceManager(queriesDir ?? QUERIES_DIR)
  const source = new Source({
    path: sourceParams.path,
    schema: { type: ConnectorType.Materialized, ...sourceSchema },
    sourceManager,
  })
  const connector = new MaterializedConnector({
    source,
    connectionParams: connParams,
  })
  source['_connector'] = connector

  return { source, connector }
}

export async function getSource(queryPath: string, queriesDir = QUERIES_DIR) {
  const sourceManager = new SourceManager(queriesDir)
  return sourceManager.loadFromQuery(queryPath)
}
