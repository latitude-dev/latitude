import colors from 'picocolors'
import { APP_FOLDER } from '../constants'
import { spawn } from 'child_process'
import { exit } from 'process'

export const cleanTerminal = () => {
  process.stdout.write('\x1bc')
}

export async function installAppDependencies() {
  console.log(colors.yellow('Installing dependencies...'))

  // TODO: Remove --force flag
  // this is here because we have an incompatibility with the SvelteKit version
  // declared as peer dependency in sveltekit-autoimport
  const npmInstall = spawn('npm', ['install', '--force'], {
    stdio: 'inherit',
    shell: true,
  })

  npmInstall.on('data', (data) => {
    console.log(colors.yellow(data))
  })

  npmInstall.on('error', (data) => {
    console.error(colors.red(`💥 Error on npm install: ${data}`))
  })

  return new Promise<void>((resolve) => {
    npmInstall.on('close', () => {
      console.log(colors.green(`✅ Dependencies installed`))

      resolve()
    })
  })
}

const COMMAND = 'npx'
const BASE_ARGS = ['vite', 'dev']

type DevServerProps = {
  appFolder?: string
  port?: number
  host?: string
  open?: boolean
  verbose?: boolean
}

export function runDevServer({
  appFolder = APP_FOLDER,
  port = 3000,
  host = 'localhost',
  open = false,
  verbose = false,
}: DevServerProps) {
  let init = true
  const tmp_args = [...BASE_ARGS, `--port=${port}`, `--host=${host}`]
  const args = open ? [...tmp_args, '--open'] : tmp_args
  const serverProccess = spawn(COMMAND, args, {
    detached: false,
    cwd: appFolder,
    stdio: 'pipe',
  })

  serverProccess.stdout?.on('data', (data) => {
    if (init) {
      cleanTerminal()

      console.log(colors.green(`Latitude Dev Server running on port ${port}`))
      init = false
    }

    if (verbose) {
      console.log(colors.gray(data))
    }
  })

  serverProccess.stderr?.on('data', (data) => {
    console.error(colors.yellow(data))
  })

  serverProccess.on('close', () => {
    console.log(colors.red('Latitude Dev Server unexpectedly closed...'))
    exit()
  })
}
