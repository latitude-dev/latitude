import boxedMessage from '../../lib/boxedMessage'
import colors from 'picocolors'
import config from '../../config'
import path from 'path'
import rootPath from '../../lib/rootPath'
import { APP_FOLDER} from '../constants'
import { cleanTerminal } from '../../utils'
import { spawn } from 'child_process'

export type DevServerProps = {
  appFolder?: string
  routePath?: string | null
  port?: number
  host?: string
  open?: boolean
  verbose?: boolean
  onReady?: () => void
}

export function runDevServer(
  {
    host = 'localhost',
    open = false,
    port = 3000,
    verbose = false,
    onReady,
  }: DevServerProps = {
    host: 'localhost',
    open: false,
    port: 3000,
    verbose: false,
  },
) {
  let building = true
  const appFolder = path.join(config.cwd, APP_FOLDER)
  const hostUrl = `http://${host}:${port}${rootPath()}`
  let args = [
    'run',
    'dev',
    '--strictPort', // This is to avoid the port conflict error
    `--port=${port}`,
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
          text: `${colors.blue('Running in')} http://localhost:${port}`,
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
