import { spawn } from 'child_process'
import path from 'path'
import colors from 'picocolors'
import { APP_FOLDER } from '../constants.js'

export async function installAppDependencies(appFolder: string = APP_FOLDER) {
  process.chdir(path.resolve(appFolder))
  console.log(colors.yellow('Installing dependencies...'))
  const npmInstall = spawn('npm', ['install'])

  npmInstall.stderr.on('data', (data) => {
    console.error(colors.red(`💥 Error: ${data}`))
  })

  return new Promise<void>((resolve) => {
    npmInstall.on('close', () => {
      console.log(colors.green(`✅ Dependencies installed`))

      resolve()
    })
  })
}

const COMMAND = 'npx'
const BASE_ARGS = ['vite', 'dev', '--port', '3000']
type DevServerProps = { appFolder?: string; open?: boolean }
export function runDevServer({
  appFolder = APP_FOLDER,
  open = false,
}: DevServerProps) {
  const args = open ? [...BASE_ARGS, '--open'] : BASE_ARGS
  const serverProccess = spawn(COMMAND, args, {
    shell: true,
    detached: false,
    cwd: appFolder,
    stdio: 'inherit',
  })

  serverProccess.stdout?.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  serverProccess.stderr?.on('data', (data) => {
    console.error(colors.red(`💥 Error: ${data}`))
  })

  serverProccess.on('close', () => {
    console.log(colors.yellow('Latitude Dev Server closed'))
  })
}
