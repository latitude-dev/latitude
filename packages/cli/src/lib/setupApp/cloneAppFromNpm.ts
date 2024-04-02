import axios from 'axios'
import colors from 'picocolors'
import config from '$src/config'
import findOrCreateConfigFile from '../latitudeConfig/findOrCreate'
import fsExtra from 'fs-extra'
import tar from 'tar'
import { PACKAGE_NAME } from '$src/commands/constants'
import { exec } from 'child_process'
import { getInstalledVersion } from '../getAppVersions'
import { onError } from '$src/utils'

import { type Props } from './index'
import { existsSync } from 'fs'

export default async function cloneAppFromNpm({
  version,
}: Props): Promise<void> {
  const latitudeJson = await findOrCreateConfigFile()
  version = version ?? latitudeJson.data.version
  const command = `npm view ${PACKAGE_NAME}@${version} dist.tarball`
  const installedVersion = getInstalledVersion(config.rootDir)

  if (installedVersion === version && existsSync(config.appDir)) return

  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        onError({ error, message: `Error cloning app from npm` })

        process.exit(1)
      }

      if (stderr) {
        // NOTE: NPM can output warnings to stderr, so we don't want to exit
        // the process, just inform the user.
        console.log(colors.yellow(stderr))
      }

      const tarballUrl = stdout.trim()
      console.log(colors.yellow(`Downloading from: ${tarballUrl}`))

      const oldApp = fsExtra.existsSync(config.appDir)

      if (oldApp) {
        console.log(colors.yellow('Uninstalling old app version...'))
        fsExtra.removeSync(config.appDir)
      }

      // Make sure the app directory exists
      fsExtra.ensureDirSync(config.appDir)

      axios({
        method: 'get',
        url: tarballUrl,
        responseType: 'stream',
      })
        .then((response) => {
          const tarStream = response.data
          const extractStream = tarStream.pipe(
            tar.x({
              strip: 1,
              cwd: config.appDir,
            }),
          )
          extractStream.on('finish', () => {
            console.log(colors.green('App server downloaded successfully 🎉'))

            resolve()
          })
        })
        .catch((error) => {
          onError({
            error,
            message: 'Error downloading latitude app',
          })

          process.exit(1)
        })
    })
  })
}
