import colors from 'picocolors'
import { spawn } from 'child_process'
import config from '../../config'
import { APP_FOLDER } from '../constants'
import boxedMessage from '../../lib/boxedMessage'
import { cleanTerminal } from '../../utils'

export type DevServerProps = {
  appFolder?: string
  routePath?: string | null
  port?: number
  host?: string
  open?: boolean
  verbose?: boolean
  onReady?: () => void
}

export function runDevServer({
  appFolder = APP_FOLDER,
  routePath = '',
  port = 3000,
  host = 'localhost',
  open = false,
  verbose = false,
  onReady,
}: DevServerProps) {
  let building = true
  const hostUrl = `http://${host}:${port}${routePath ? routePath : ''}`
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
