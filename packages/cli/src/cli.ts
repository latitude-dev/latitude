#!/usr/bin/env node

import sade from 'sade'
import colors from 'picocolors'
import startDataProject from './commands/start/index'
import config from './config'
import devCommand from './commands/dev'

const CLI = sade('latitude')

CLI.version(process.env.PACKAGE_VERSION ?? 'development').option(
  '--debug',
  'Enables verbose console logs',
)

CLI.command('start')
  .describe('Setup you data project with an example data source')
  .action(startDataProject)

CLI.command('dev')
  .describe('Launch the local Latitude development environment')
  .action(devCommand)

CLI.command('deploy')
  .describe('Deploy data app to production')
  .action((_args) => {
    console.log(colors.red('Not implemented yet'))
  })

const parsedArgs = CLI.parse(process.argv, { lazy: true })

config.debug = parsedArgs?.args
config.dev = process.env.NODE_ENV === 'development'

parsedArgs?.handler.apply(null, parsedArgs?.args)
