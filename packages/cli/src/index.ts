#!/usr/bin/env node

import buildCommand from './commands/build'
import colors from 'picocolors'
import config from './config'
import devCommand from './commands/dev'
import sade from 'sade'
import startDataProject from './commands/start/index'
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

CLI.command('build')
  .describe('Build data app for production')
  .option('--target', 'Platform you want to build for. Default: vercel')
  .action(buildCommand)

CLI.command('deploy')
  .describe('Deploy data app to production')
  .action(() => {
    console.log(colors.red('Not implemented yet'))
  })

async function initCli() {
  const parsedArgs = CLI.parse(process.argv, { lazy: true })

  const args = parsedArgs?.args
  config.setDebug(args)
  config.setDev({ dev: process.env.NODE_ENV === 'development', args })

  await config.setPkgManager()
  config.setCwd(args)

  parsedArgs?.handler.apply(null, args)
}

initCli()
