#!/usr/bin/env node

import buildCommand from './commands/build'
import config from './config'
import credentialsCommand from './commands/credentials'
import devCommand from './commands/dev'
import runCommand from './commands/run'
import sade from 'sade'
import startCommand from './commands/start'
import telemetryCommand from './commands/telemetry'
import updateCommand from './commands/update'
import { onError } from './utils'
import initSentry from '$src/integrations/sentry'

initSentry()

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
  .option('--name', 'Name of the project')
  .option('--template', 'Template to use for the data app')
  .option('--port', 'Port to run the data app on')
  .action(startCommand)

CLI.command('update')
  .describe('Update latitude app.You can define the version with --version')
  .option('--fix', 'Installed the version in your latitude.json file')
  .action(updateCommand)

CLI.command('telemetry')
  .describe('Allow enable or disable telemetry')
  .option('--enable', 'Enable telemetry')
  .option('--disable', 'Disable telemetry')
  .option('--status', 'Check the status of telemetry')
  .action(telemetryCommand)

CLI.command('build')
  .describe('Build data app for production')
  .action(buildCommand)

CLI.command('dev')
  .describe('Launch the local Latitude development environment')
  .option(
    '--open',
    'Open the data app in your browser, Default: yes. Options: yes, no',
  )
  .option('--port', 'Port to run the data app on')
  .action(devCommand)

CLI.command('run <query_name>')
  .describe('Run a query from the data app.')
  .option('--watch', 'Re-run the query each time the query file changes')
  .option(
    '--param',
    'Add a parameter to the query. Use the format --param <name>=<value>',
  )
  .example('run --watch users')
  .example('run users --param user_id=foo')
  .action(runCommand)

CLI.command('credentials')
  .describe('Manage credentials for the data app')
  .option(
    '--create-master-key',
    "Create a master key for the data app. If you didn't had one in your .env file",
  )
  .option(
    '--overwrite-master-key',
    'Create or update a master key. Be careful with this option. If you were already using the old key you will need to change your code.',
  )
  .action(credentialsCommand)

async function init() {
  const argv = CLI.parse(process.argv, { lazy: true })

  try {
    await config.init(process.argv)
  } catch (error) {
    onError({
      error: error as Error,
      message: (error as Error).message,
    })

    process.exit(1)
  }

  argv?.handler.apply(null, argv?.args)
}

init()
