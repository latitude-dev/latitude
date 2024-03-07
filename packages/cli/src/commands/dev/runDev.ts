import colors from 'picocolors'
import { spawn } from 'child_process'
import openFn from 'open'
import { APP_FOLDER } from '../constants'

export const cleanTerminal = () => {
  process.stdout.write('\x1bc')
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
  })

  serverProccess.stdout?.on('data', (data) => {
    const isReady = READY_REGEX.test(data.toString())
    if (isReady && building) {
      console.log(colors.green(`Latitude Dev Server ready at ${hostUrl}`))

      if (open) openFn(hostUrl)

      building = false
    }
  })

  serverProccess.stderr?.on('data', (data) => {
    if (data.includes('WARNING')) return // ignore warnings

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
