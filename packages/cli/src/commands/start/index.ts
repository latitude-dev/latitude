import colors from 'picocolors'
import { Handler } from 'sade'
import path from 'path'
import showBanner from 'node-banner'
import { setDebugMode } from '../../utils.js'
import cloneTemplate from './cloneTemplate.js'
import setupLatitudeApp from './setupLatitudeApp.js'
import { installAppDependencies, runDevServer } from '../dev/runDev.js'
import { APP_FOLDER } from '../constants.js'

type ErrorColor = 'red' | 'yellow'
type OnErrorProps = { error: Error; message: string; color?: ErrorColor }
type OnErrorFn = (args: OnErrorProps) => void
export type CommonProps = { onError: OnErrorFn }

function onError({ error, message, color = 'red' }: OnErrorProps) {
  const colorFn = color === 'red' ? colors.red : colors.yellow
  console.error(colorFn(`${message} \nERROR:\n${error}`))
  process.exit(1)
}

async function displayMessage(dataAppDir: string) {
  await showBanner(
    'Latitude SDK',
    `
    Welcome to Latitude SDK 🎉
    You can start your project by running:
    $ cd ${dataAppDir}
    $ latitude dev
  `,
    'green',
    'white',
  )
}

const startDataProject: Handler = async (args) => {
  setDebugMode(args)
  const dataAppDir = (await cloneTemplate({ onError })) as string
  await setupLatitudeApp({
    onError,
    destinationPath: dataAppDir,
  })

  // Move user to Data App folder
  const dataAppDirPath = path.resolve(dataAppDir)
  process.chdir(dataAppDirPath)

  const tmpAppFolder = `${process.cwd()}/${APP_FOLDER}`
  await installAppDependencies(tmpAppFolder)
  displayMessage(dataAppDir)
  runDevServer({ appFolder: tmpAppFolder, open: true })
}

export default startDataProject
