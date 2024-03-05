import { exec } from 'child_process'
import axios from 'axios'
import colors from 'picocolors'
import fsExtra from 'fs-extra'
import tar from 'tar'
import { Props } from './setupApp'
import { LATITUDE_FOLDER } from '../constants'

const PACKAGE_NAME = '@latitude-data/server'
export default async function cloneAppFromNpm({
  onError,
  destinationPath,
  appVersion,
}: Props) {
  const latitudeFolder = `${destinationPath}/${LATITUDE_FOLDER}`
  const appDir = `${latitudeFolder}/app`
  fsExtra.emptyDirSync(`${process.cwd()}/${appDir}`)
  const command = `npm view ${PACKAGE_NAME}@${appVersion} dist.tarball`

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        onError({ error, message: `Error cloning app from npm`, color: 'red' })
        return
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`)
        onError({
          error: new Error('Unexpected error'),
          message: `Error cloning app from npm`,
          color: 'red',
        })
        return
      }

      const tarballUrl = stdout.trim()
      console.log(colors.yellow(`Downloading from: ${tarballUrl}`))

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
