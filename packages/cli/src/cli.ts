import colors from 'picocolors'
import sade from 'sade'
import { getPackageVersion, setDebugMode } from './utils.js'
import startDataProject from './commands/start/index.js'

const DEBUG = { flag: '--debug', msg: 'Enables verbose console logs' }
const CLI = sade('latitude')

CLI.version(await getPackageVersion())

CLI.command('start')
  .describe('Setup you data project with an example data source')
  .option(DEBUG.flag, DEBUG.msg)
  .action(startDataProject)

CLI.command('dev')
  .describe('Launch the local Latitude development environment')
  .option(DEBUG.flag, DEBUG.msg)
  .action((args) => {
    const lol = setDebugMode(args)

    console.log(colors.magenta('DEV command'), lol)
    return lol
  })

CLI.command('build')
  .option(DEBUG.flag, DEBUG.msg)
  .describe('build production outputs')
  .action((args) => {
    const lol = setDebugMode(args)
    console.log(colors.red('Not implemented yet'), lol)
  })

CLI.parse(process.argv)
