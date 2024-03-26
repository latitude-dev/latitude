import colors from 'picocolors'
import { spawn } from 'child_process'
import { CLIConfig } from '$src/config'

export default async function installAppDependencies() {
  const config = CLIConfig.getInstance()
  const appFolder = config.appDir
  console.log(colors.yellow('Installing dependencies...'))

  return new Promise<boolean>((resolve, reject) => {
    const npmInstall = spawn('npm', ['install'], {
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
