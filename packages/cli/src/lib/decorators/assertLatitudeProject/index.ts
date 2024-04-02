import { LATITUDE_CONFIG_FILE } from '$src/commands/constants'
import { onError } from '$src/utils'
import fs from 'fs'
import path from 'path'

export default function assertLatitudeProject(commandFn: Function) {
  return async function (...args: any[]) {
    if (!fs.existsSync(path.join(process.cwd(), LATITUDE_CONFIG_FILE))) {
      onError({
        message:
          'The current directory is not a Latitude project. Move to an actual Latitude project or run `latitude setup` in the current directory to set it up as a Latitude project.',
      })

      process.exit(1)
    }

    return commandFn(...args)
  }
}
