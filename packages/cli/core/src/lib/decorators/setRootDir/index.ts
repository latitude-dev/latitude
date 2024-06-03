import config from '$src/config'
import fs from 'fs'
import path from 'path'
import { LATITUDE_CONFIG_FILE } from '$src/commands/constants'
import { onError } from '$src/utils'

export function findRootDir(maxTries = 100) {
  let currentDir = process.cwd()
  let tries = 0

  /* eslint-disable no-constant-condition */
  while (true) {
    const latitudeJsonPath = path.join(currentDir, LATITUDE_CONFIG_FILE)
    if (tries >= maxTries) {
      onError({
        message: `After ${maxTries} iterations, latitude.json was not found.`,
      })

      process.exit(1)
    }

    if (fs.existsSync(latitudeJsonPath)) {
      return currentDir
    } else {
      const parentDir = path.dirname(currentDir)
      if (parentDir === currentDir) {
        onError({
          message:
            'Could not find latitude.json in any parent directory. Move to a Latitude project or run `latitude setup` in the current directory to set it up as a Latitude project.',
        })

        process.exit(1)
      }

      currentDir = parentDir
      tries++
    }
  }
}

export default function setRootDir(commandFn: Function) {
  return async function (...args: any[]) {
    const rootDir = findRootDir()
    config.rootDir = rootDir

    return commandFn(...args)
  }
}
