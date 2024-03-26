import cloneTemplate from './cloneTemplate'
import colors from 'picocolors'
import config from '$src/config'
import setupApp from '$src/lib/setupApp/index'
import startQuestions, { TemplateUrl } from './questions'
import telemetry from '$src/lib/telemetry'
import { OnErrorFn } from '$src/types'
import { getLatitudeBanner } from '$src/utils'
import { onError } from '$src/utils'
import { runDevServer } from '$src/commands/dev/runDev'

export type CommonProps = { onError: OnErrorFn }

async function welcomeMessage() {
  const banner = await getLatitudeBanner()
  const projectDir = config.name.replace(/"/g, '\\"')
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
  const rootDir = (await cloneTemplate({
    dest,
    template: choosenTemplate,
    force,
  })) as string
  config.rootDir = rootDir

  await setupApp()
  await welcomeMessage()

  if (open) {
    runDevServer({ open, port })
  } else {
    process.exit()
  }
}
