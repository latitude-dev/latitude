import createConfigFile from './create'
import findConfigFile, { ConfigFile } from './findConfigFile'
import validate from './validate'

export default async function findOrCreateConfigFile(
  { next = false }: { next: boolean } = { next: false },
): Promise<ConfigFile> {
  const config = findConfigFile()
  const validated = validate(config.data)
  if (validated.valid) return config

  return createConfigFile({ next, version: config?.data?.version })
}
