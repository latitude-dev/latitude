import chalk from 'chalk'
import config from '$src/config'
import fs from 'fs-extra'
import getLatestVersion from './getLatestVersion'
import { ConfigFile } from './findConfigFile'
import { onError } from '$src/utils'

export default async function createConfigFile({
  version,
}: {
  version?: string
}): Promise<ConfigFile> {
  try {
    version = version ?? (await getLatestVersion())
  } catch (error) {
    onError({
      error: error as Error,
      message: 'Error getting latest Latitude version from npm registry',
    })

    process.exit(1)
  }

  if (!version) {
    onError({
      message:
        'No Latitude versions found. If the issue persists, please report it.',
    })

    process.exit(1)
  }

  const data = { name: config.name, version }

  try {
    fs.writeJsonSync(config.latitudeJsonPath, data, { spaces: 2 })
  } catch (error) {
    onError({
      error: error as Error,
      message: `Error writing config file to ${chalk.bold(
        config.latitudeJsonPath,
      )}`,
    })

    process.exit(1)
  }

  // TODO: remove path prop
  return {
    data,
    path: config.latitudeJsonPath,
  }
}
