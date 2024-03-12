import boxedMessage from '../../lib/boxedMessage'
import colors from 'picocolors'
import config from '../../config'
import path from 'path'
import rootPath from '../../lib/rootPath'
import { APP_FOLDER} from '../constants'
import { cleanTerminal } from '../../utils'
import { spawn } from 'child_process'
import portfinder from 'portfinder'

export type DevServerProps = {
  appFolder?: string
  routePath?: string | null
  port?: number
  host?: string
  open?: boolean
  verbose?: boolean
  onReady?: () => void
}

export async function runDevServer(
  {
    host = 'localhost',
    open = false,
    port,
    verbose = false,
    onReady,
  }: DevServerProps = {
    host: 'localhost',
    open: false,
    verbose: false,
  },
) {
  let building = true

  if (port && !(await isPortAvailable(port))) {
    boxedMessage({
      text: `Port ${port} is not available`,
      color: 'red',
    })
    process.exit()
  }

  const appFolder = path.join(config.cwd, APP_FOLDER)
  const appPort: number = port || (await findFreePort(3000, 4000))

  const hostUrl = `http://${host}:${appPort}${rootPath()}`
  let args = [
    'run',
    'dev',
    '--strictPort',
    `--port=${appPort}`,
    `--host=${host}`,
    open ? `--open=${hostUrl}` : '',
  ].filter((f) => f !== '')

  const serverProccess = spawn(config.pkgManager.command, args, {
    cwd: appFolder,
    stdio: 'pipe',
  })

  console.log(colors.yellow('Starting Latitude ...'))

  serverProccess.stdout?.on('data', (data) => {
    const logmsg = data.toString()
    if (verbose) {
      console.log(logmsg)
    }

    if (building && logmsg.includes('ready in')) {
      cleanTerminal()
      if (onReady) {
        onReady()
      } else {
        boxedMessage({
          title: 'Latitude server',
          text: `${colors.blue('Running in')} http://localhost:${appPort}`,
          color: 'green',
        })
      }
      building = false
    }
  })

  serverProccess.stderr?.on('error', (err) => {
    boxedMessage({
      text: `Latitude Dev Server error: ${err.message}`,
      color: 'red',
    })
    process.exit()
  })

  serverProccess.stdout?.on('close', () => {
    boxedMessage({
      text: 'Latitude Server closed',
      color: 'yellow',
    })
    process.exit()
  })
}

async function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    portfinder.getPort({ port }, (err, foundPort) => {
      if (err) {
        resolve(false)
      }
      resolve(foundPort === port)
    })
  })
}

async function findFreePort(startPort: number, endPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    portfinder.getPort({
      port: startPort,
      stopPort: endPort,
    }, (err, foundPort) => {
      if (err) {
        reject(err)
      }
      resolve(foundPort)
    })
  })
}