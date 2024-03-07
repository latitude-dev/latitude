import colors from 'picocolors'
import { spawn } from 'child_process'
import openFn from 'open'
import { APP_FOLDER } from '../constants'

export const cleanTerminal = () => {
  process.stdout.write('\x1bc')
}

export async function installAppDependencies({
  dataAppDir,
}: {
  dataAppDir: string
}) {
  const appFolder = `${dataAppDir}/${APP_FOLDER}`
  console.log(colors.yellow(`Installing dependencies... ${appFolder}`))

  // TODO: Remove --force flag
  // this is here because we have an incompatibility with the SvelteKit version
  // declared as peer dependency in sveltekit-autoimport
  return new Promise<void>((resolve) => {
    const npmInstall = spawn('npm', ['install', '--force'], {
      cwd: appFolder,
      shell: true,
    })

    // Listen for stdout data (standard output)
    npmInstall.stdout.on('data', (data) => {
      console.log(colors.yellow(data))
    })

    // Listen for stderr data (standard error)
    npmInstall.stderr.on('data', (data) => {
      console.error(colors.red(data))
    })

    // Handle the close event
    npmInstall.on('close', (code) => {
      console.log(`npm install process exited with code ${code}`)
      resolve()
    })
  })
}

export type DevServerProps = {
  appFolder?: string
  routePath?: string | null
  port?: number
  host?: string
  open?: boolean
  verbose?: boolean
}

const READY_REGEX = /ready in \d+ ms/
export function runDevServer({
  appFolder = APP_FOLDER,
  routePath = '',
  port = 3000,
  host = 'localhost',
  open = false,
  verbose = false,
}: DevServerProps) {
  console.log(colors.yellow(`${appFolder} is the app folder`))
  let building = true
  const logLevel = verbose ? 'debug' : 'silent'
  let args = [
    'run',
    'dev',
    `--port=${port}`,
    `--host=${host}`,
    `--logLevel=${logLevel}`,
  ]

  const hostUrl = `http://${host}:${port}${routePath ? routePath : ''}`
  const serverProccess = spawn('npm', args, {
    detached: false,
    cwd: appFolder,
    stdio: 'pipe',
  })

  serverProccess.stdout?.on('data', (data) => {
    const isReady = READY_REGEX.test(data.toString())
    if (isReady && building) {
      cleanTerminal()

      if (open) {
        openFn(hostUrl)
      }

      console.log(colors.green(`Latitude Dev Server running on port ${port}`))
      building = false
    }

    if (verbose) {
      console.log(colors.gray(data))
    }
  })

  serverProccess.stderr?.on('data', (data) => {
    console.error(colors.yellow(data))
  })

  serverProccess.on('error', (err) => {
    console.error(colors.red(`Latitude Dev Server error: ${err.message}`))
    process.exit()
  })

  serverProccess.on('close', (code, signal) => {
    console.log(
      colors.yellow(`Latitude Server closed... ${code} ${signal?.toString()}`),
    )
    process.exit()
  })
}
