import fs from 'fs'
import colors from 'picocolors'
import path from 'path'
import { input, confirm, select } from '@inquirer/prompts'
import degit from 'degit'
import { CommonProps } from './index.js'
import { DEV_SITES_ROUTE_PREFIX, LATITUDE_GITHUB_SLUG } from '../constants.js'
import config from '../../config'

export enum TemplateUrl {
  default = 'default',
  netflix = 'netflix',
}
const TEMPLATE_URL: Record<TemplateUrl, string> = {
  [TemplateUrl.default]: `${LATITUDE_GITHUB_SLUG}/template`,
  [TemplateUrl.netflix]: `${LATITUDE_GITHUB_SLUG}/sample-netflix`,
}

async function askForDestination({ onError }: CommonProps) {
  let dest = null
  let force = false
  try {
    dest = await input({ message: 'Whats the name of your project?' })
  } catch (err) {
    onError({
      error: err as Error,
      message: '😢 Creation stopped, ready when you are!',
      color: 'yellow',
    })
    return { dest, force }
  }

  if (!dest) return { dest, force }

  dest = config.dev ? `${DEV_SITES_ROUTE_PREFIX}/${dest}` : dest

  const isDestinationEmpty =
    !fs.existsSync(dest) || fs.readdirSync(dest).length === 0

  if (isDestinationEmpty) {
    force = true
  } else {
    force = await confirm({
      message: 'Directory is not empty. Do you want to continue?',
      default: false,
    })
  }

  return { force, dest: path.resolve(`./${dest}`) }
}

async function askForTemplate(): Promise<TemplateUrl> {
  try {
    return select<TemplateUrl>({
      message: 'Pick a template',
      default: TemplateUrl.default,
      choices: [
        { value: TemplateUrl.default, name: 'Default (Empty project)' },
        { value: TemplateUrl.netflix, name: 'Netflix (Some examples)' },
      ],
    })
  } catch (err) {
    process.exit(0)
  }
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

  const tmp = await askForTemplate()
  return new Promise<string>((resolve) => {
    const template = degit(TEMPLATE_URL[tmp], { force });
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
