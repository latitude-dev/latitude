import sourceManager from '../../src/lib/server/sourceManager'
import { QUERIES_DIR } from '../../src/lib/constants'
import render from '@latitude-data/display_table'
import path from 'path'
import { parseArgs, type ParseArgsConfig } from 'node:util'
import { parseFromUrl } from '@latitude-data/custom_types'

type CommandArgs = {
  queryPath: string
  parameters: Record<string, unknown>
  watch: boolean
  debug: boolean
}

type CommandOptions = {
  debug?: boolean
  watch?: boolean
  param?: string[]
}

const OPTIONS = {
  debug: {
    type: 'boolean',
    short: 'd',
    default: false,
  },
  watch: {
    type: 'boolean',
    short: 'w',
    default: false,
  },
  param: {
    type: 'string',
    short: 'p',
    multiple: true,
  },
}

function getArgs(): CommandArgs {
  const args = process.argv.slice(2)
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: OPTIONS as ParseArgsConfig['options'],
  })

  // TODO: Temporal warning to avoid breaking errors. This will only show up when updating the server but not the CLI
  if (positionals.length > 1) {
    console.error(
      'CLI version not compatible. To update the CLI, run `npm i -g @latitude-data/cli`',
    )
    process.exit(1)
  }

  if (positionals.length !== 1) {
    console.error('Usage: run <query> ...options')
    process.exit(1)
  }

  const queryPath = positionals[0]!
  const { debug, watch, param } = values as CommandOptions

  const paramsUrl = param
    ?.reduce((acc: string[], param: string) => {
      const [key, ...rest] = param.split('=')
      const value = rest.join('=')
      return [...acc, `${key}=${value}`]
    }, [])
    .join('&')

  const parameters = paramsUrl ? parseFromUrl(paramsUrl) : {}

  return { queryPath, parameters, watch: watch ?? false, debug: debug ?? false }
}

const args = getArgs()

render({
  sourceManager,
  queriesDir: path.resolve(QUERIES_DIR),
  query: args.queryPath,
  params: args.parameters,
  debug: args.debug,
  watch: args.watch,
})
