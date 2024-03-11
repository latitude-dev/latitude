import colors from 'picocolors'
import { getLatitudeBanner } from '../../utils'
import cloneTemplate from './cloneTemplate'
import config from '../../config'
import { OnErrorFn } from '../../types'
import setupApp from '../../lib/setupApp/index'
import { onError } from '../../utils'
import findOrCreateLatitudeConfig from '../../lib/latitudeConfig/findOrCreate'
import { runDevServer } from '../dev/runDev'

export type CommonProps = { onError: OnErrorFn }

async function displayMessage() {
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

    $ cd ./${config.projectConfig.projectName}
    $ ${config.dev ? 'pnpm latitude-dev dev' : 'latitude dev'}
    `),
  )
}

export default async function startDataProject({
  open = false,
}: {
  open: boolean
}) {
  // Clone template
  const dataAppDir = (await cloneTemplate({ onError })) as string
  config.setCwd(dataAppDir)

  // Setup Latitude configuration
  const latitudeConfig = await findOrCreateLatitudeConfig({
    appDir: dataAppDir,
    pkgManager: config.pkgManager,
  })

  // We already handled the error
  if (!latitudeConfig) return

  config.loadConfig()

  // Setup application server for running queries
  const installationComplete = await setupApp({
    appVersion: config.projectConfig.appVersion,
  })

  // Something went wrong. We already handled the error
  if (!installationComplete) return

  await displayMessage()

  if (open) {
    runDevServer()
  } else {
    process.exit()
  }
}
