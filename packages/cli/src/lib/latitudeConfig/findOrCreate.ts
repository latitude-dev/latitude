import colors from 'picocolors'
import path from 'path'
import fsExtra from 'fs-extra'
import { LATITUDE_CONFIG_FILE } from '../../commands/constants'

import defaultConfig from './defaultConfig.json'
import { getLatitudeVersions } from '../getAppVersions'
import validate from './validate'
import { PackageManagerWithFlags } from '../../config'
import boxedMessage from '../boxedMessage'

async function getLatestVersion(pkgManager: PackageManagerWithFlags) {
  try {
    const versions = await getLatitudeVersions({ pkgManager })
    const latestVersion = versions[0]
    if (!latestVersion) {
      boxedMessage({
        title: 'Failed to get Latitude version',
        text: `Please try again later`,
        color: 'red',
      })
    }

    return latestVersion
  } catch (error) {
    boxedMessage({
      title: 'Failed to get Latitude version',
      text: `There was an erorr ${(error as Error).message}`,
      color: 'red',
    })
    return null
  }
}

type ConfigData = {
  appVersion?: string,
  projectName: string,
  deployPlatform?: string,
}
type ConfigFile = {
  data: ConfigData,
  path: string
}
export function findConfigFile({ appDir, throws }: { appDir: string, throws: boolean}): ConfigFile {
  const configPath = `${appDir}/${LATITUDE_CONFIG_FILE}`
  const data = fsExtra.readJsonSync(configPath, { throws }) as ConfigData
  return {
    path: configPath,
    data,
  }
}

export default async function findOrCreateLatitudeConfig({
  appDir,
  pkgManager,
}: {
  appDir: string
  pkgManager: PackageManagerWithFlags
}): Promise<ConfigFile | null> {
  const projectName = path.basename(appDir)
  const config = findConfigFile({ appDir, throws: false })

  let allGood = false
  try {
    const appVersion = config.data?.appVersion || (await getLatestVersion(pkgManager))
    if (!appVersion) return null

    const data = { ...defaultConfig, projectName, appVersion }
    const validated = validate(data)

    if (!validated.valid) {
      console.error(validated.errors.message, validated.errors)
      return null
    }

    fsExtra.writeJsonSync(config.path, data, { spaces: 2 })
    console.log(colors.green(`✅ Created ${path.basename(config.path)}`))
    allGood = true
  } catch (err) {
    boxedMessage({
      title: `Error creating Latitude ${path.basename(config.path)}}`,
      text: (err as Error).message,
      color: 'red',
    })
  }

  return allGood ? config : null
}
