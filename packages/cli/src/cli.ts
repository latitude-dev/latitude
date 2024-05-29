#!/usr/bin/env node

import buildCommand from './commands/build'
import cancelCommand from './commands/cloud/cancel'
import config from './config'
import credentialsCommand from './commands/credentials'
import deployCommand from './commands/cloud/deploy'
import destroyCommand from './commands/cloud/destroy'
import devCommand from './commands/dev'
import initSentry from '$src/integrations/sentry'
import loginCommand from './commands/cloud/login'
import logoutCommand from './commands/cloud/logout'
import runCommand from './commands/run'
import materializeCommand from './commands/materialize'
import sade from 'sade'
import setupCommand from './commands/setup'
import signupCommand from './commands/cloud/signup'
import startCommand from './commands/start'
import telemetryCommand from './commands/telemetry'
import updateCommand from './commands/update'
import createTokenCommand from './commands/cloud/tokens/create'
import addSecretCommand from './commands/cloud/secrets/add'
import removeSecretCommand from './commands/cloud/secrets/remove'
import { onError } from './utils'

initSentry()

const CLI = sade('latitude')

CLI.version(process.env.PACKAGE_VERSION ?? 'development')
  .option('--verbose', 'Enables verbose console logs')
  .option('--simulate-pro', 'Enable pro mode in development')

if (process.env.NODE_ENV === 'development') {
  CLI.option(
    '--folder',
    'Use in development to specify the Latitude app folder to run',
  )
}

CLI.command('start')
  .describe('Start a Latitude app from a template')
  .option('--name', 'Name of the project')
  .option('--template', 'Template to use for the Latitude app')
  .option('--port', 'Port to run the Latitude app on')
  .option(
    '--canary',
    'Whether to display canary releases of Latitude as available versions',
  )
  .action(startCommand)

CLI.command('update')
  .describe('Update latitude app. You can define the version with --version')
  .option(
    '--force',
    'Forces update of dockerignore and Dockerfile files to the latest version',
  )
  .option('--fix', 'Installs the version defined in latitude.json')
  .option(
    '--canary',
    'Whether to display canary releases of Latitude as available versions',
  )
  .action(updateCommand)

CLI.command('telemetry')
  .describe('Allow enable or disable telemetry')
  .option('--enable', 'Enable telemetry')
  .option('--disable', 'Disable telemetry')
  .option('--status', 'Check the status of telemetry')
  .action(telemetryCommand)

CLI.command('build')
  .describe('Build Latitude app for production')
  .action(buildCommand)

CLI.command('dev')
  .describe('Launch the local Latitude development environment')
  .option('--open', 'Open the Latitude app in your browser. (default: true)')
  .option('--port', 'Port to run the Latitude app on')
  .action(devCommand)

CLI.command('run <query_name>')
  .describe('Run a query from the Latitude app.')
  .option('--watch', 'Re-run the query each time the query file changes')
  .option('--debug', 'Instead of running the query, print the generated SQL')
  .option(
    '--param',
    'Add a parameter to the query. Use the format --param <name>=<value>',
  )
  .example('run --watch users')
  .example('run users --param user_id=foo --param limit=10')
  .action(runCommand)

CLI.command('materialize')
  .describe(
    'Materialize all queries that are configured with \n    {@config materialize_query: true}',
  )
  .option('--debug', 'Show time taken to materialize the queries')
  .option('--queries', 'Run only the specified queries')
  .action(materializeCommand)

CLI.command('setup')
  .describe('Setup the current directory as a Latitude app')
  .action(setupCommand)

CLI.command('credentials add')
  .describe('Generate a secret master key for ')
  .option(
    '--create-master-key',
    "Create a master key for the Latitude app. If you didn't had one in your .env file. IMPORTANT: generate a new one when you deploy your app to production.",
  )
  .example('credentials add > .env')
  .action(credentialsCommand)

CLI.command('signup').describe('Signup for a new account').action(signupCommand)

CLI.command('login')
  .describe('Login for an existing account')
  .action(loginCommand)

CLI.command('logout')
  .describe('Logout an existing account')
  .action(logoutCommand)

CLI.command('deploy')
  .describe('Deploy your Latitude app to the cloud')
  .option('--force', 'Force the deployment even if the build has not changed')
  .option('--nocache', 'Do not use cache when building the Docker image')
  .option(
    '--materialize',
    'Materialize the queries and store it in Docker image before deploying',
  )
  .action(deployCommand)

CLI.command('destroy')
  .describe('Destroy a deployed Latitude app')
  .action(destroyCommand)

CLI.command('cancel')
  .describe('Cancels an ongoing deployment')
  .action(cancelCommand)

CLI.command('tokens create')
  .describe('Creates an authentication token for Latitude Cloud')
  .action(createTokenCommand)
CLI.command('secrets add')
  .describe('Add an environment variable to your Latitude Cloud')
  .example('secrets add MY_SECRET=some_secret_value OTHER_SECRET=secret')
  .action(addSecretCommand)
CLI.command('secrets remove')
  .describe('Remove an environment variable from your Latitude Cloud')
  .example('secrets remove MY_SECRET')
  .action(removeSecretCommand)

async function init() {
  const argv = CLI.parse(process.argv, {
    lazy: true,
  })

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
