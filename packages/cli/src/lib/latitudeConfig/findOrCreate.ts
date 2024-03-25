import colors from 'picocolors'
import defaultConfig from './defaultConfig.json'
import findConfigFile, { ConfigFile } from './findConfigFile'
import fsExtra from 'fs-extra'
import getLatestVersion from './getLatestVersion'
import path from 'path'
import validate from './validate'
import { PackageManagerWithFlags } from '$src/config'
import { onError } from '$src/utils'

export default async function findOrCreateConfigFile({
  appDir,
  pkgManager,
}: {
  appDir: string
  pkgManager: PackageManagerWithFlags
}): Promise<ConfigFile | null> {
  try {
    const config = findConfigFile({ appDir, throws: false })
    const version = config.data?.version || (await getLatestVersion(pkgManager))
    if (!version) return null

    const data = { ...defaultConfig, name: path.basename(appDir), version }
    const validated = validate(data)

    if (!validated.valid) {
      console.error(validated.errors.message, validated.errors)
      return null
    }

    fsExtra.writeJsonSync(config.path, data, { spaces: 2 })
    console.log(colors.green(`✅ Created ${path.basename(config.path)}`))

    return config
  } catch (error) {
    onError({
      error: error as Error,
      message: 'Error finding or creating config file',
    })

    process.exit(1)
  }
}
