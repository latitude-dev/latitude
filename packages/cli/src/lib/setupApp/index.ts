import config from '$src/config'
import findOrCreateConfigFile from '../latitudeConfig/findOrCreate'
import installDependencies from './installDependencies'
import installLatitudeServer from '../installLatitudeServer'
import path from 'path'
import { createMasterKey } from '$src/commands/credentials/createMasterKey'
import { existsSync, writeFileSync } from 'fs'
import { onError } from '$src/utils'

export type Props = { version?: string }

// Adds a package.json file to the app directory in development environment so
// that you can run the cli in development mode with `npm run latitude-dev`
function addPackageJson() {
  if (config.pro) return

  const packageJsonPath = path.resolve(config.rootDir, 'package.json')
  if (existsSync(packageJsonPath)) return

  const packageJson = {
    scripts: {
      'latitude-dev': '../../node_modules/.bin/latitude',
    },
  }

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

export default async function setupApp() {
  const config = await findOrCreateConfigFile()
  await installLatitudeServer({ version: config.data.version })
  await installDependencies()
  addPackageJson()
  createMasterKey()
}
