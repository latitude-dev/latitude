import fs from 'fs'
import colors from 'picocolors'
import enquirer from 'enquirer'
import degit from 'degit'
import { CommonProps } from './index.js'

const REPO_SLUG = 'latitude-dev/template'
type Options = { dest: string | null }
export default async function cloneTemplate({ onError }: CommonProps) {
  let options: Options = { dest: null }
  try {
    options = await enquirer.prompt<Options>([
      {
        type: 'input',
        name: 'dest',
        message: 'Whats the name of your project?',
        initial: '.',
      },
    ])
  } catch (err) {
    onError({
      error: err as Error,
      message: '😢 Creation stopped, ready when you are!',
      color: 'yellow',
    })
  }

  const destination = options.dest

  if (!destination) return

  const isDestinationEmpty =
    !fs.existsSync(destination) || fs.readdirSync(destination).length === 0

  if (!isDestinationEmpty) {
    const { force } = await enquirer.prompt<{ force: boolean }>([
      {
        type: 'toggle',
        name: 'force',
        message: 'Directory is not empty. Do you want to continue?',
      },
    ])

    if (!force) {
      onError({
        error: new Error('Directory not empty'),
        message: '! Directory not empty — aborting',
      })
    }
  }

  return new Promise<string>((resolve) => {
    const template = degit(REPO_SLUG, { force: true })
    console.log(colors.yellow(`📦 Cloning template to ${destination}`))

    template.on('info', () => {
      console.log(colors.green('✅ template cloned'))

      return resolve(destination)
    })

    template.clone(destination).catch((err) => {
      onError({
        error: err,
        message: `💥 Error cloning template in ${destination}`,
      })
    })
  })
}
