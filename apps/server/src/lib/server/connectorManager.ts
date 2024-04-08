import { type BaseConnector } from '@latitude-data/base-connector'
import { createConnector } from '@latitude-data/connector-factory'

const connectors: Record<string, BaseConnector> = {}

export function loadConnector(sourcePath: string): BaseConnector {
  if (!connectors[sourcePath]) {
    connectors[sourcePath] = createConnector(sourcePath)
  }

  return connectors[sourcePath]
}

export async function clearConnector(sourcePath: string): Promise<void> {
  await connectors[sourcePath]?.end()
  delete connectors[sourcePath]
}

export async function clearAllConnector(): Promise<void> {
  await Promise.all(Object.keys(connectors).map(clearConnector))
}
