import colors from 'picocolors'
import path from 'path'
import { Handler } from 'sade'
import { getLatitudeBanner } from '../../utils.js'
import cloneTemplate from './cloneTemplate.js'
import setupApp from './setupApp.js'
import { installAppDependencies } from '../dev/runDev.js'
import config from '../../config.js'
import runLatitudeServer from '../dev/runLatitudeServer.js'

type ErrorColor = 'red' | 'yellow'
type OnErrorProps = { error: Error; message: string; color?: ErrorColor }
type OnErrorFn = (_args: OnErrorProps) => void
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
  const isPro = config.pro || config.simulatedPro
  // Clone template
  const dataAppDir = (await cloneTemplate({ onError })) as string
  const appVersion = args['version'] ?? 'latest'

  // Setup application server for running queries
  await setupApp({
    onError,
    destinationPath: dataAppDir,
    appVersion,
  })

  // Once the app is cloned, we need to install the dependencies
  // in the data app folder
  process.chdir(path.resolve(dataAppDir))

  if (isPro) {
    await installAppDependencies({ dataAppDir })
  }

  displayMessage(dataAppDir)

  runLatitudeServer({ devServer: { appFolder: dataAppDir, open: true } })
}

export default startDataProject
