import { input, confirm, select } from '@inquirer/prompts'
import fs from 'fs'
import path from 'path'

import { DEV_SITES_ROUTE_PREFIX } from '../constants.js'
import config from '$src/config'
import { onError } from '$src/utils'

async function askForDestination() {
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

  return { force, empty: isDestinationEmpty, dest: path.resolve(`./${dest}`) }
}

export enum TemplateUrl {
  default = 'default',
  netflix = 'netflix',
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

const DEFAULT_RESPONSE = {
  dest: null,
  template: TemplateUrl.default,
  force: false,
  telemetry: false,
}
export default async function startQuestions() {
  const { dest, empty, force } = await askForDestination()

  if (!dest) return DEFAULT_RESPONSE
  if (!empty && !force) process.exit(0)

  return {
    dest,
    force,
    template: await askForTemplate(),
  }
}
