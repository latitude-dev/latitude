import { type BaseConnector } from '@latitude-data/base-connector'
import { createConnector } from '@latitude-data/connector-factory'

const connectors: Record<string, BaseConnector> = {}

export async function loadConnector(
  sourcePath: string,
): Promise<BaseConnector> {
  if (!connectors[sourcePath]) {
    connectors[sourcePath] = await createConnector(sourcePath)
  }

  return connectors[sourcePath]
}

export async function clearConnector(sourcePath: string): Promise<void> {
  await connectors[sourcePath]?.end()
  delete connectors[sourcePath]
}

export async function clearAllConnectors(): Promise<void> {
  await Promise.all(Object.keys(connectors).map(clearConnector))
}
