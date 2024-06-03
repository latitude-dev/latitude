import config from '$src/config'
import { onError } from '$src/utils'
import fsExtra from 'fs-extra'

export type ConfigData = {
  version?: string
  name?: string
}

export type ConfigFile = {
  data: ConfigData
  path: string
}

export default function findConfigFile(): ConfigFile {
  try {
    if (!fsExtra.existsSync(config.latitudeJsonPath)) {
      // TODO: remove path prop
      return { data: {}, path: config.latitudeJsonPath }
    }

    const data = fsExtra.readJsonSync(config.latitudeJsonPath) as ConfigData

    // TODO: remove path prop
    return {
      path: config.latitudeJsonPath,
      data,
    }
  } catch (error) {
    onError({
      error: error as Error,
      message: `Error reading config file from ${config.latitudeJsonPath}`,
    })

    process.exit(1)
  }
}
