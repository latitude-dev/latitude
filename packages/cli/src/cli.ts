#!/usr/bin/env node

import sade from 'sade'
import colors from 'picocolors'
import startDataProject from './commands/start/index'
import config from './config'
import devCommand from './commands/dev'
import updateCommand from './commands/update'

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
  .action(startDataProject)

CLI.command('update')
  .describe('Update latitude app.You can define the version with --version')
  .action(updateCommand)

const cliDev = CLI.command('dev')
  .describe('Launch the local Latitude development environment')
  .option(
    '--open',
    'Open the data app in your browser, Default: yes. Options: yes, no',
  )

cliDev.action(devCommand)

CLI.command('deploy')
  .describe('Deploy data app to production')
  .action((_args) => {
    console.log(colors.red('Not implemented yet'))
  })

async function initCli() {
  const parsedArgs = CLI.parse(process.argv, { lazy: true })

  const args = parsedArgs?.args
  config.debug = args
  config.setDev({
    dev: process.env.NODE_ENV === 'development',
    args,
  })
  await config.setupPkgManager()

  parsedArgs?.handler.apply(null, parsedArgs?.args)
}

initCli()
