#!/usr/bin/env node

import buildCommand from './commands/build'
import colors from 'picocolors'
import config from './config'
import devCommand from './commands/dev'
import sade from 'sade'
import startDataProject from './commands/start/index'
import updateCommand from './commands/update'
import prepareCommand from './commands/prepare'
import runCommand from './commands/run'
import boxedMessage from './lib/boxedMessage'

const CLI = sade('latitude')

CLI.version(process.env.PACKAGE_VERSION ?? 'development')
  .option('--debug', 'Enables verbose console logs')
  .option('--simulate-pro', 'Enable pro mode in development')

if (process.env.NODE_ENV === 'development') {
  CLI.option(
    '--folder',
    'Use in development to specify the data app folder to run',
  )
}

CLI.command('start')
  .describe('Setup you data project with an example data source')
  .option('--port', 'Port to run the data app on')
  .action(startDataProject)

CLI.command('update')
  .describe('Update latitude app.You can define the version with --version')
  .option('--fix', 'Installed the version in your latitude.json file')
  .action(updateCommand)

const cliDev = CLI.command('dev')
  .describe('Launch the local Latitude development environment')
  .option(
    '--open',
    'Open the data app in your browser, Default: yes. Options: yes, no',
  )
  .option('--port', 'Port to run the data app on')

cliDev.action(devCommand)

CLI.command('build')
  .describe('Build data app for production')
  .action(buildCommand)

CLI.command('deploy')
  .describe('Deploy data app to production')
  .action(() => {
    console.log(colors.red('Not implemented yet'))
  })

CLI.command('prepare')
  .describe('Prepares data app for production build')
  .action(prepareCommand)

CLI.command('run <query_name>')
  .describe('Run a query from the data app.')
  .option('--watch', 'Re-run the query each time the query file changes')
  .option('--param', 'Add a parameter to the query. Use the format --param <name>=<value>')
  .example("run --watch users")
  .example("run users --param user_id=foo")
  .action((query_name: string, opts: { param: string[] | string; watch: boolean }) => {
    let params = opts.param
    if (typeof params === 'string') params = [params]
    else if (!Array.isArray(params)) params = []
    const watch = opts.watch
    runCommand(query_name, params, watch)
  })

async function initCli() {
  const argv = process.argv
  const parsedArgs = CLI.parse(argv, { lazy: true })

  try {
    await config.init(argv)
  } catch (error) {
    const message = (error as Error).message
    boxedMessage({
      text: message,
      title: 'Error in latitude.json',
      color: 'red',
    })
    process.exit(1)
  }

  parsedArgs?.handler.apply(null, parsedArgs?.args)
}

initCli()
