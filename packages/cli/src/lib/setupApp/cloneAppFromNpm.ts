import { exec } from 'child_process'
import axios from 'axios'
import colors from 'picocolors'
import fsExtra from 'fs-extra'
import tar from 'tar'
import { Props } from './index'
import config from '../../config'
import { LATITUDE_FOLDER, PACKAGE_NAME } from '../../commands/constants'

export default async function cloneAppFromNpm({ onError, appVersion }: Props) {
  const latitudeFolder = `${config.cwd}/${LATITUDE_FOLDER}`
  const appDir = `${latitudeFolder}/app`
  const command = `${config.pkgManager.command} view ${PACKAGE_NAME}@${appVersion} dist.tarball`

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        onError({ error, message: `Error cloning app from npm`, color: 'red' })
        return
      }

      if (stderr) {
        // NOTE: NPM can output warnings to stderr, so we don't want to exit
        // the process, just inform the user.
        console.error(stderr)
      }

      const tarballUrl = stdout.trim()
      console.log(colors.yellow(`Downloading from: ${tarballUrl}`))

      // TODO: Check if requested version is current version
      // This will be easier when we have `latitude.json` and "appVersion"
      // field in it.
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
            resolve(true)
          })
        })
        .catch((error) => {
          onError({
            error,
            message: 'Error downloading latitude app',
            color: 'red',
          })
          reject(error)
        })
    })
  })
}
