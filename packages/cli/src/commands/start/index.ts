import path from 'path'
import colors from 'picocolors'
import { getLatitudeBanner } from '$src/utils'
import { CLIConfig } from '$src/config'
import { OnErrorFn } from '$src/types'
import setupApp from '$src/lib/setupApp/index'
import { onError } from '$src/utils'
import findOrCreateLatitudeConfig from '$src/lib/latitudeConfig/findOrCreate'
import telemetry from '$src/lib/telemetry'
import { runDevServer } from '$src/commands/dev/runDev'
import cloneTemplate from './cloneTemplate'
import startQuestions, { TemplateUrl } from './questions'
import createDotEnv from './createDotEnv'

export type CommonProps = { onError: OnErrorFn }

async function welcomeMessage() {
  const config = CLIConfig.getInstance()
  const banner = await getLatitudeBanner()
  const projectDir = path.basename(config.source).replace(/"/g, '\\"')
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
  name,
  port,
  template = TemplateUrl.default,
  open = false,
}: {
  open: boolean
  port?: number
  name?: string
  template?: TemplateUrl
}) {
  const {
    dest,
    template: choosenTemplate,
    force,
  } = await startQuestions({ name, template })
  const config = CLIConfig.getInstance()

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
  const dataAppDir = (await cloneTemplate({
    dest,
    template: choosenTemplate,
    force,
  })) as string
  config.setCwd(dataAppDir)

  // Setup Latitude configuration
  const latitudeConfig = await findOrCreateLatitudeConfig({ appDir: dataAppDir })

  // We already handled the error
  if (!latitudeConfig) return

  config.loadConfig()

  createDotEnv({ config })
  await setupApp({ version: config.projectConfig.version })
  await welcomeMessage()

  if (open) {
    runDevServer({ open, port })
  } else {
    process.exit()
  }
}
