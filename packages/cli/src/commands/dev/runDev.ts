import colors from 'picocolors'
import { spawn } from 'child_process'
import config from '../../config'
import { APP_FOLDER } from '../constants'
import { cleanTerminal } from '../../utils'

export type DevServerProps = {
  appFolder?: string
  routePath?: string | null
  port?: number
  host?: string
  open?: boolean
  verbose?: boolean
}

export function runDevServer({
  appFolder = APP_FOLDER,
  routePath = '',
  port = 3000,
  host = 'localhost',
  open = false,
  verbose = false,
}: DevServerProps) {
  let building = true
  const logLevel = verbose ? 'debug' : 'silent'
  const hostUrl = `http://${host}:${port}${routePath ? routePath : ''}`
  let args = [
    'run',
    'dev',
    `--port=${port}`,
    `--host=${host}`,
    open ? `--open=${hostUrl}` : '',
    `--logLevel=${logLevel}`,
  ].filter((f) => f !== '')

  const serverProccess = spawn(config.pkgManager.command, args, {
    detached: false,
    cwd: appFolder,
    stdio: verbose ? 'inherit' : 'ignore',
  })

  serverProccess?.on('data', () => {
    if (building) {
      cleanTerminal()

      console.log(colors.green(`Latitude Dev Server running on port ${port}`))
      building = false
    }
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
