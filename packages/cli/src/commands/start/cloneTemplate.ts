import fs from 'fs'
import colors from 'picocolors'
import path from 'path'
import enquirer from 'enquirer'
import degit from 'degit'
import { CommonProps } from './index.js'
import { DEV_SITES_ROUTE_PREFIX, LATITUDE_GITHUB_SLUG } from '../constants.js'
import config from '../../config'

const REPO_SLUG = `${LATITUDE_GITHUB_SLUG}/template`
type Options = { dest: string | null; force: boolean }

async function askForDestination({ onError }: CommonProps) {
  let options: Options = { dest: null, force: false }

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
    return options
  }

  if (!options.dest) return options

  options.dest = config.dev
    ? `${DEV_SITES_ROUTE_PREFIX}/${options.dest}`
    : options.dest

  const isDestinationEmpty =
    !fs.existsSync(options.dest) || fs.readdirSync(options.dest).length === 0

  if (isDestinationEmpty) {
    options.force = true
  } else {
    const { force } = await enquirer.prompt<{ force: boolean }>([
      {
        type: 'toggle',
        name: 'force',
        message: 'Directory is not empty. Do you want to continue?',
      },
    ])
    options.force = force
  }

  return { ...options, dest: path.resolve(`./${options.dest}`) }
}

export default async function cloneTemplate({ onError }: CommonProps) {
  const { dest, force } = await askForDestination({ onError })

  if (!dest) {
    onError({
      error: new Error('No destination'),
      message: '🚧 No destination provided',
      color: 'red',
    })
    return
  }

  return new Promise<string>((resolve) => {
    const template = degit(REPO_SLUG, { force })
    console.log(colors.yellow(`📦 Cloning template to ${dest}`))

    template.on('info', () => {
      console.log(colors.green('✅ template cloned'))

      return resolve(dest)
    })

    template.clone(dest).catch((err) => {
      onError({
        error: err,
        message: `💥 Error cloning template in ${dest}`,
      })
    })
  })
}
