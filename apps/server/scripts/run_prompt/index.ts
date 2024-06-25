import modelManager from '../../src/lib/server/modelManager'
import ora from 'ora'
import chalk from 'chalk'
import cliWidth from 'cli-width'
import { parseArgs, type ParseArgsConfig } from 'node:util'
import { parseFromUrl } from '@latitude-data/custom_types'

type CommandArgs = {
  prompt: string
  params: Record<string, unknown>
  debug: boolean
}

const OPTIONS = {
  debug: {
    type: 'boolean',
    short: 'd',
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
  const { debug, param } = values as { debug?: boolean; param?: string[] }
  const paramsUrl = param
    ?.reduce((acc: string[], param: string) => {
      const [key, ...rest] = param.split('=')
      const value = rest.join('=')
      return [...acc, `${key}=${value}`]
    }, [])
    .join('&')
  const params = paramsUrl ? parseFromUrl(paramsUrl) : {}

  const [prompt] = positionals as string[]
  if (!prompt) throw new Error('Prompt is required')

  return {
    debug: debug ?? false,
    prompt,
    params,
  }
}

async function runPrompt({ prompt, params, debug }: CommandArgs) {
  const spinner = ora().start()

  const onDebug = (message: string) => {
    spinner.text = message
  }

  let lastToken = ''
  let currentLine = 0
  const onToken = async (token: string) => {
    if (spinner.isSpinning) spinner.stop()

    /* Fancy printing method ahead. I could just print the token and call it a day
     but I'm going to try to make it look nicer. :)
    */

    // Re-print the last token with its regular color
    process.stdout.moveCursor(-lastToken.length, 0)
    process.stdout.write(chalk.reset(lastToken))

    // If there's going to be a new line (either by line break or by overflowing),
    // print the part of the token before the new line with its regular color
    if (token.includes('\n')) {
      const parts = token.split('\n')
      parts.slice(0, -1).forEach((part) => {
        process.stdout.write(chalk.reset(part))
        process.stdout.write('\n')
      })
      token = parts[parts.length - 1]!
      currentLine = 0
    }

    const maxWidth = cliWidth()
    if (currentLine + token.length > maxWidth) {
      const leftChars = maxWidth - currentLine
      process.stdout.write(token.slice(0, leftChars))
      token = token.slice(leftChars)
      currentLine = 0
    }

    // Print the rest of the token with a blue color
    process.stdout.write(chalk.blue(token))
    lastToken = token
    currentLine += token.length
  }

  try {
    const model = await modelManager.loadFromPrompt(prompt)

    if (debug) {
      const compiledPrompt = await model.compilePrompt({
        promptPath: prompt,
        params,
        onDebug,
      })
      spinner.stop()
      console.log(compiledPrompt.prompt)
      return
    }

    await model.runPrompt({ promptPath: prompt, params, onDebug, onToken })
    await onToken('')
    if (spinner.isSpinning) spinner.stop()
    console.log()
  } catch (e) {
    const error = e as Error
    if (spinner.isSpinning) {
      spinner.fail(error.message)
    } else {
      console.error(error.message)
    }
  }
}

const args = getArgs()

runPrompt(args)
