import colors from 'picocolors'
import { getLatitudeBanner } from '$src/utils'
import cloneTemplate from './cloneTemplate'
import config from '$src/config'
import { OnErrorFn } from '$src/types'
import setupApp from '$src/lib/setupApp/index'
import { onError } from '$src/utils'
import findOrCreateLatitudeConfig from '$src/lib/latitudeConfig/findOrCreate'
import { runDevServer } from '../dev/runDev'
import path from 'path'
import telemetry from '$src/lib/telemetry'
import startQuestions from './questions'

export type CommonProps = { onError: OnErrorFn }

async function displayMessage() {
  const banner = await getLatitudeBanner()
  const projectDir = path.basename(config.cwd).replace(/"/g, '\\"')
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

    $ cd ./${projectDir.includes(' ') ? `"${projectDir}"` : projectDir}
    $ ${config.dev ? 'pnpm latitude-dev dev' : 'latitude dev'}
    `),
  )
}
export default async function start({
  open = false,
  port,
}: {
  open: boolean
  port?: number
}) {
  const { dest, template, force } = await startQuestions()

  if (!dest) {
    onError({
      error: new Error('No destination'),
      message: '🚧 No destination provided',
      color: 'red',
    })

    return
  }

  await telemetry.track({ event: 'startCommand' })

  // Clone template
  const dataAppDir = (await cloneTemplate({ dest, template, force })) as string
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
    version: config.projectConfig.version,
  })

  // Something went wrong. We already handled the error
  if (!installationComplete) return

  await displayMessage()

  if (open) {
    runDevServer({ open, port })
  } else {
    process.exit()
  }
}
