import colors from 'picocolors'
import sade from 'sade'
import { getPackageVersion } from './utils.js'

const CLI = sade('latitude')

CLI.command('version')
  .describe('Latitude CLI version')
  .action(async () => {
    const version = await getPackageVersion()
    console.log(colors.cyan(`Latitude CLI version: ${version}`))
  })

CLI.command('dev')
  .describe('launch the local Latitude development environment')
  .option('--debug', 'Enables verbose console logs')
  .action(() => {
    console.log(colors.red('Not implemented yet'))
  })

CLI.command('build')
  .option('--debug', 'Enables verbose console logs')
  .describe('build production outputs')
  .action(() => {
    console.log(colors.red('Not implemented yet'))
  })

CLI.parse(process.argv)
