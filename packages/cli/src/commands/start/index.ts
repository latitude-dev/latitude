import colors from 'picocolors'
import { getLatitudeBanner } from '../../utils'
import cloneTemplate from './cloneTemplate'
import config from '../../config'
import runLatitudeServer from '../dev/runLatitudeServer'
import { OnErrorFn } from '../../types'
import setupApp from '../../lib/setupApp/index'
import { onError } from '../../utils'

export type CommonProps = { onError: OnErrorFn }
async function displayMessage(dataAppDir: string) {
  const banner = await getLatitudeBanner()
  console.log(colors.green(banner))
  console.log(
    colors.white(`
    ${
      config.dev
        ? '👋 Hi dev, thanks for contributing'
        : 'Welcome to Latitude data 🎉'
    }

    You can start your project by running:
    --------------------------------------

    $ cd ./${dataAppDir}
    $ latitude dev
    `),
  )
}

export default async function startDataProject() {
  // Clone template
  const dataAppDir = (await cloneTemplate({ onError })) as string

  // Setup application server for running queries
  const installationComplete = await setupApp({
    onError,
    destinationPath: dataAppDir,
  })

  // Something went wrong. We already handled the error
  if (!installationComplete) return

  displayMessage(dataAppDir)

  runLatitudeServer({ devServer: { appFolder: dataAppDir, open: true } })
}
