import colors from 'picocolors'
import defaultConfig from './defaultConfig.json'
import fsExtra from 'fs-extra'
import path from 'path'
import validate from './validate'
import { LATITUDE_CONFIG_FILE } from '$src/commands/constants'
import { getLatitudeVersions } from '../getAppVersions'
import { onError } from '$src/utils'

async function getLatestVersion() {
  try {
    const versions = await getLatitudeVersions()
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

export function findConfigFile({
  appDir,
}: {
  appDir: string
}): ConfigData | undefined {
  return fsExtra.readJsonSync(`${appDir}/${LATITUDE_CONFIG_FILE}`)
}

export default async function findOrCreateConfigFile({
  appDir,
}: {
  appDir: string
}): Promise<ConfigData | null> {
  const config = findConfigFile({ appDir })
  validate!(config)

  return await createConfigFile({ appDir })
}

async function createConfigFile({ appDir }: { appDir: string }) {
  try {
    const version = await getLatestVersion()
    const newConfig = { ...defaultConfig, name: path.basename(appDir), version }
    const destination = `${appDir}/${LATITUDE_CONFIG_FILE}`

    fsExtra.writeJsonSync(destination, newConfig, { spaces: 2 })

    console.log(colors.green(`✅ Created ${LATITUDE_CONFIG_FILE}`))

    return newConfig
  } catch (err) {
    onError({
      error: err as Error,
      message: '🚨 Failed to create config file',
    })

    process.exit(1)
  }
}
