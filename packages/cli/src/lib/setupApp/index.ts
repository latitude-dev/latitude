import path from 'path'
import { CLIConfig } from '$src/config'
import cloneAppFromNpm from './cloneAppFromNpm'
import symlinkAppFromLocal from './symlinkAppFromLocal'
import installAppDependencies from './installDependencies'
import updateVersion from '../latitudeConfig/updateVersion'
import { onError } from '$src/utils'
import { existsSync, writeFileSync } from 'fs'
import findOrCreateConfigFile from '../latitudeConfig/findOrCreate'
import { LATITUDE_SERVER_FOLDER } from '$src/commands/constants'

export type Props = { version?: string }

// Adds a package.json file to the app directory in development environment so
// that you can run the cli in development mode with `npm run latitude-dev`
function addPackageJson() {
  const packageJson = {
    scripts: {
      'latitude-dev': '../../node_modules/.bin/latitude',
    },
  }

  const config = CLIConfig.getInstance()
  const packageJsonPath = path.resolve(config.source, 'package.json')

  try {
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  } catch (e) {
    onError({
      error: e as Error,
      message: '🚨 Failed to create package.json file',
    })

    process.exit(1)
  }
}

export default async function setupApp({
  version: requestedVersion,
}: Props = {}) {
  const config = CLIConfig.getInstance()

  await findOrCreateConfigFile({
    appDir: config.source,
    pkgManager: config.pkgManager,
  })

  config.loadConfig()

  const version = requestedVersion || config.projectConfig.version
  const isPro = config.pro || config.simulatedPro
  const installServer = isPro ? cloneAppFromNpm : symlinkAppFromLocal

  if (!existsSync(`${config.source}/${LATITUDE_SERVER_FOLDER}`)) {
    await installServer({ version })
  }

  // Change directory to the app folder
  process.chdir(path.resolve(config.source))

  if (!isPro) return addPackageJson()

  try {
    await installAppDependencies()
  } catch (e) {
    onError({
      error: e as Error,
      message: `
      🚨 Failed to install dependencies

      Update latitude and try again. If this does not solve the problem,
      please open an issue on GitHub:
      https://gitub.com/latitude-dev/latitude/issues
      `,
    })

    process.exit(1)
  }

  try {
    await updateVersion({ appDir: config.source, version })
  } catch (e) {
    onError({
      error: e as Error,
      message: '🚨 Failed to update app version',
    })

    process.exit(1)
  }
}
