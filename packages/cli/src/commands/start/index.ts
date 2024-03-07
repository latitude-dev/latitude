import colors from 'picocolors'
import { Handler } from 'sade'
import { getLatitudeBanner } from '../../utils'
import cloneTemplate from './cloneTemplate'
import config from '../../config'
import runLatitudeServer from '../dev/runLatitudeServer'
import { OnErrorFn, OnErrorProps } from '../../types'
import setupApp from '../../lib/setupApp/index'

export type CommonProps = { onError: OnErrorFn }

function onError({ error, message, color = 'red' }: OnErrorProps) {
  const colorFn = color === 'red' ? colors.red : colors.yellow
  console.error(colorFn(`${message} \nERROR:\n${error}`))
  process.exit(1)
}

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

const startDataProject: Handler = async (args) => {
  // Clone template
  const dataAppDir = (await cloneTemplate({ onError })) as string
  const appVersion = args['version'] ?? 'latest'

  // Setup application server for running queries
  const installationComplete = await setupApp({
    onError,
    destinationPath: dataAppDir,
    appVersion,
  })

  // Something went wrong. We already handled the error
  if (!installationComplete) return

  displayMessage(dataAppDir)

  runLatitudeServer({ devServer: { appFolder: dataAppDir, open: true } })
}

export default startDataProject
