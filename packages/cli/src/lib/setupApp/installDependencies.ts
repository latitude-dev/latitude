import colors from 'picocolors'
import { spawn } from 'child_process'
import { APP_FOLDER } from '../../commands/constants'
import config from '../../config'

export default async function installAppDependencies({
  dataAppDir,
}: {
  dataAppDir: string
  appVersion?: string
}) {
  const appFolder = `${dataAppDir}/${APP_FOLDER}`
  let args = ['install', '--legacy-peer-deps']
  args = config.pro ? [...args, '--silent'] : args

  console.log(colors.yellow('Installing dependencies...'))

  // TODO: Remove --force flag
  // this is here because we have an incompatibility with the SvelteKit version
  // declared as peer dependency in sveltekit-autoimport
  return new Promise<void>((resolve, reject) => {
    const npmInstall = spawn('npm', args, {
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
