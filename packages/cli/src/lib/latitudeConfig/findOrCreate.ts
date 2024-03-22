import colors from 'picocolors'
import path from 'path'
import fsExtra from 'fs-extra'
import { LATITUDE_CONFIG_FILE } from '$src/commands/constants'

import defaultConfig from './defaultConfig.json'
import { getLatitudeVersions } from '../getAppVersions'
import validate from './validate'
import { PackageManagerWithFlags } from '$src/config'
import { onError } from '$src/utils'

async function getLatestVersion(pkgManager: PackageManagerWithFlags) {
  try {
    const versions = await getLatitudeVersions({ pkgManager })
    const latestVersion = versions[0]
    if (!latestVersion) {
      console.log(colors.red('🚨 Failed to get Latitude version'))

      process.exit(1)
    }

    return latestVersion
  } catch (error) {
    onError({
      error: error as Error,
      message: '🚨 Failed to get Latitude version',
    })

    process.exit(1)
  }
}

type ConfigData = {
  version?: string
  name: string
}
type ConfigFile = {
  data: ConfigData
  path: string
}

export function findConfigFile({
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

export default async function findOrCreateConfigFile({
  appDir,
  pkgManager,
}: {
  appDir: string
  pkgManager: PackageManagerWithFlags
}): Promise<ConfigFile | null> {
  const config = findConfigFile({ appDir, throws: false })

  try {
    const version = config.data?.version || (await getLatestVersion(pkgManager))
    if (!version) {
      onError({
        error: new Error('Failed to get latest version'),
        message: '🚨 Failed to get latest version from npm',
      })

      process.exit(1)
    }

    const data = { ...defaultConfig, name: path.basename(appDir), version }
    const validated = validate(data)

    if (!validated.valid) {
      onError({
        error: new Error('Invalid configuration'),
        message: `🚨 Invalid configuration: ${JSON.stringify(
          validated.errors,
        )}`,
      })

      process.exit(1)
    }

    fsExtra.writeJsonSync(config.path, data, { spaces: 2 })

    console.log(colors.green(`✅ Created ${path.basename(config.path)}`))
  } catch (err) {
    onError({
      error: err as Error,
      message: '🚨 Failed to create config file',
    })

    process.exit(1)
  }

  return config
}
