import colors from 'picocolors'
import { spawn } from 'child_process'
import config from '$src/config'

export default async function installAppDependencies() {
  const appFolder = config.appDir
  let args = ['install', ...config.pkgManager.flags.mandatoryInstallFlags]
  args = config.pro
    ? [...args, config.pkgManager.flags.installFlags.silent]
    : args

  console.log(colors.yellow('Installing dependencies...'))

  return new Promise<boolean>((resolve, reject) => {
    const npmInstall = spawn(config.pkgManager.command, args, {
      cwd: appFolder,
      shell: true,
      stdio: 'inherit',
    })

    // Handle the close event
    npmInstall.on('close', (code) => {
      if (code !== 0) {
        reject(false)
      } else {
        console.log(colors.green('Dependencies installed successfully 🎉'))
        resolve(true)
      }
    })
  })
}
