import config from '$src/config'
import { onError } from '$src/utils'
import { existsSync, writeFileSync } from 'fs'
import path from 'path'

export default function addPackageJson() {
  const packageJsonPath = path.resolve(config.rootDir, 'package.json')
  if (existsSync(packageJsonPath)) return

  const packageJson = config.dev
    ? {
        scripts: {
          'latitude-dev': '../../node_modules/.bin/latitude',
        },
      }
    : {}

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
