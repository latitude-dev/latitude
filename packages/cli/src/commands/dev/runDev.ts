import boxedMessage from '$src/lib/boxedMessage'
import colors from 'picocolors'
import config from '$src/config'
import path from 'path'
import { APP_FOLDER } from '../constants'
import { cleanTerminal } from '$src/utils'
import portfinder from 'portfinder'
import spawn from '$src/lib/spawn'

export type DevServerProps = {
  appFolder?: string
  routePath?: string | null
  port?: number
  host?: string
  open?: boolean
  verbose?: boolean
  onReady?: () => void
}

let building = true

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
  if (port && !(await isPortAvailable(port))) {
    console.log(colors.red(`Port ${port} is not available`))

    process.exit()
  }

  const appFolder = path.join(config.rootDir, APP_FOLDER)
  const appPort: number = port || (await findFreePort(3000, 4000))
  const hostUrl = `http://${host}:${appPort}`
  const args = [
    'run',
    'dev',
    '--strictPort',
    `--port=${appPort}`,
    `--host=${host}`,
    open ? `--open=${hostUrl}` : '',
  ].filter((f) => f !== '')

  const handlers = {
    onClose,
    onError,
    onStderr,
    onStdout: onStdout({ verbose, onReady, appPort }),
  }

  spawn('npm', args, { cwd: appFolder }, handlers)

  console.log(colors.yellow('Starting Latitude ...'))
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

async function findFreePort(
  startPort: number,
  endPort: number,
): Promise<number> {
  return new Promise((resolve, reject) => {
    portfinder.getPort(
      {
        port: startPort,
        stopPort: endPort,
      },
      (err, foundPort) => {
        if (err) {
          reject(err)
        }
        resolve(foundPort)
      },
    )
  })
}

const onStdout =
  ({ verbose, onReady, appPort }: DevServerProps & { appPort: number }) =>
  (data: Buffer) => {
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
          text: `${colors.blue('Listening on')} http://localhost:${appPort}`,
          color: 'green',
        })
      }

      building = false
    }
  }

const onStderr = (data: Buffer) => {
  const str = data.toString()
  if (str.includes('WARNING')) return

  console.log(colors.yellow(str))
}

const onError = (error: Error) => {
  console.log(colors.red(`Server error: ${error.message}`))
}

const onClose = (code?: number) => {
  console.log(colors.yellow(`\n Server closed with code: ${code || 0}`))

  process.exit(code ?? 0)
}
