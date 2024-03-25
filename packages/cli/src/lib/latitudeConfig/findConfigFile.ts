import { LATITUDE_CONFIG_FILE } from '$src/commands/constants'
import fsExtra from 'fs-extra'

export type ConfigData = {
  version?: string
  name: string
}

export type ConfigFile = {
  data: ConfigData
  path: string
}

export default function findConfigFile({
  appDir,
  throws,
}: {
  appDir: string
  throws: boolean
}): ConfigFile {
  const configPath = `${appDir}/${LATITUDE_CONFIG_FILE}`
  const data = fsExtra.readJsonSync(configPath, { throws }) as ConfigData

  return {
    path: configPath,
    data,
  }
}
