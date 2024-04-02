import createConfigFile from './create'
import findConfigFile, { ConfigFile } from './findConfigFile'
import validate from './validate'

export default async function findOrCreateConfigFile(): Promise<ConfigFile> {
  const config = findConfigFile()
  const validated = validate(config.data)
  if (validated.valid) return config

  return createConfigFile({ version: config?.data?.version })
}
