import colors from 'picocolors'
import { getLatitudeBanner } from '$src/utils'
import cloneTemplate from './cloneTemplate'
import { CLIConfig } from '$src/config'
import { OnErrorFn } from '$src/types'
import setupApp from '$src/lib/setupApp/index'
import { onError } from '$src/utils'
import { runDevServer } from '../dev/runDev'
import path from 'path'
import telemetry from '$src/lib/telemetry'
import startQuestions, { TemplateUrl } from './questions'

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
        : 'Welcome to Latitude 🎉'
    }

    You can start your project by running:
    --------------------------------------

    $ cd ./${projectDir.includes(' ') ? `"${projectDir}"` : projectDir}
    $ ${config.dev ? 'pnpm latitude-dev dev' : 'latitude dev'}
    `),
  )
}
export default async function startCommand({
  port,
  open = false,
  name = undefined,
  template = undefined,
}: {
  port: number
  open?: boolean
  name?: string
  template?: TemplateUrl
}) {
  const {
    dest,
    template: chosenTemplate,
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
    template: chosenTemplate,
    force,
  })) as string

  config.setSource(dataAppDir)

  await setupApp()
  await welcomeMessage()

  if (open) {
    runDevServer({ open, port })
  } else {
    process.exit()
  }
}
