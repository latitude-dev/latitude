import colors from 'picocolors'
import { spawn } from 'child_process'
import { APP_FOLDER } from '../../commands/constants'
import config from '../../config'

export default async function installAppDependencies(_: {
  appVersion?: string
}) {
  const appFolder = `${config.cwd}/${APP_FOLDER}`
  let args = ['install', ...config.pkgManager.flags.mandatoryInstallFlags]
  args = config.pro
    ? [...args, config.pkgManager.flags.installFlags.silent]
    : args

  console.log(colors.yellow('Installing dependencies...'))

  return new Promise<void>((resolve, reject) => {
    const npmInstall = spawn(config.pkgManager.command, args, {
      cwd: appFolder,
      shell: true,
      stdio: 'inherit',
    })

    // Listen for stdout data (standard output)
    npmInstall.on('data', (data) => {
      console.log(colors.yellow(data))
    })

    // Listen for stderr data (standard error)
    npmInstall.on('data', (data) => {
      console.error(colors.red(data))
    })

    // Handle the close event
    npmInstall.on('close', (code) => {
      if (code !== 0) {
        console.error(colors.red('💥 Failed to install dependencies'))
        console.log(`
Update latitude and try again. If this does not solve the problem,
please open an issue on GitHub:
https://github.com/latitude-dev/latitude/issues
`)
        reject()
      } else {
        console.log(colors.green('Dependencies installed successfully 🎉'))
        resolve()
      }
    })
  })
}
