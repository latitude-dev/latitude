import createConfigFile from './create'
import findConfigFile, { ConfigFile } from './findConfigFile'
import validate from './validate'

export default async function findOrCreateConfigFile(
  { canary = false }: { canary: boolean } = { canary: false },
): Promise<ConfigFile> {
  const config = findConfigFile()
  const validated = validate(config.data)
  if (validated.valid) return config

  return createConfigFile({ canary, version: config?.data?.version })
}
