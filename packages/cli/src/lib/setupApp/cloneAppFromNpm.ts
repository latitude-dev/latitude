import { exec } from 'child_process'
import axios from 'axios'
import colors from 'picocolors'
import fsExtra from 'fs-extra'
import tar from 'tar'
import config from '$src/config'
import { LATITUDE_FOLDER, PACKAGE_NAME } from '$src/commands/constants'
import { onError } from '$src/utils'
import { type Props } from './index'
import { getInstalledVersion } from '../getAppVersions'
import boxedMessage from '../boxedMessage'

export default async function cloneAppFromNpm({
  version: updateVersion,
}: Props): Promise<void> {
  const latitudeFolder = `${config.cwd}/${LATITUDE_FOLDER}`
  const appDir = `${latitudeFolder}/app`
  const version = updateVersion ?? config.projectConfig.version
  const command = `${config.pkgManager.command} view ${PACKAGE_NAME}@${version} dist.tarball`
  const installedVersion = getInstalledVersion(config.cwd)

  if (installedVersion === version) {
    boxedMessage({
      title: 'Same version',
      text: `${colors.blue('Version')} ${colors.green(version)} ${colors.blue(
        'is already installed',
      )}`,
      color: 'green',
    })

    return
  }

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

      const oldApp = fsExtra.existsSync(appDir)

      if (oldApp) {
        console.log(colors.yellow('Uninstalling old app version...'))
        fsExtra.removeSync(appDir)
      }

      // Make sure the app directory exists
      fsExtra.ensureDirSync(appDir)

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
              cwd: appDir,
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
