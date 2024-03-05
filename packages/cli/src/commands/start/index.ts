import colors from 'picocolors'
import path from 'path'
import { Handler } from 'sade'
import { getLatitudeBanner } from '../../utils.js'
import cloneTemplate from './cloneTemplate.js'
import setupApp from './setupApp.js'
import { installAppDependencies, runDevServer } from '../dev/runDev.js'
import { APP_FOLDER } from '../constants.js'
import config from '../../config.js'

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

function cdToAppFolder(destinationPath: string) {
  const dataAppDirPath = path.resolve(destinationPath)
  const appFolder = `${dataAppDirPath}/${APP_FOLDER}`
  process.chdir(dataAppDirPath)
  return appFolder
}

const startDataProject: Handler = async (args) => {
  // Clone template
  const dataAppDir = (await cloneTemplate({ onError })) as string
  const appVersion = args['app-version'] ?? 'latest'

  // Setup application server for running queries
  await setupApp({
    onError,
    destinationPath: dataAppDir,
    appVersion,
  })

  displayMessage(dataAppDir)

  // In development we go manually to the app folder
  // in the monorepo and install the dependencies
  if (config.dev) return

  const appFolder = cdToAppFolder(dataAppDir)
  await installAppDependencies({ cwd: appFolder })
  runDevServer({ appFolder, open: true })
}

export default startDataProject
