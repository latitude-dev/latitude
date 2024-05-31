import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fsExtra from 'fs-extra'
import fs from 'fs'
import { OnErrorProps } from './types'
import boxedMessage from './lib/boxedMessage'

/**
 * This ASCII log is generated using the following website:
 * https://patorjk.com/software/taag/#p=display&h=0&v=0&f=Larry%203D&t=Latitude
 */
export async function getLatitudeBanner(): Promise<string | null> {
  const dir = dirname(fileURLToPath(import.meta.url))
  const logoPath = join(dir, 'latitude-banner.txt')
  return new Promise((resolve, reject) => {
    fs.readFile(logoPath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file *.txt:', err)
        reject()
      }
      resolve(data)
    })
  })
}

export async function forceSymlink(
  source: string,
  target: string,
): Promise<void> {
  await fsExtra.ensureDir(dirname(target))
  const targetStats = fs.lstatSync(target)

  if (targetStats.isDirectory()) {
    fs.rmSync(target, { recursive: true })
  } else {
    fs.unlinkSync(target)
  }

  return new Promise((resolve, reject) => {
    fs.symlink(source, target, (err) => {
      if (err) {
        reject(err)
      }

      resolve()
    })
  })
}

export function onError({
  error,
  message,
  exit = true,
  color = 'red',
}: OnErrorProps) {
  boxedMessage({
    text: error ? `${message} \nERROR:\n${error}` : message,
    title: 'Error',
    color,
  })

  if (exit) process.exit(1)
}

export const cleanTerminal = () => {
  process.stdout.write('\x1bc')
}

export function onExit(fn: (...args: any) => void) {
  process.on('exit', fn)
  process.on('SIGINT', fn)
  process.on('SIGQUIT', fn)
  process.on('SIGTERM', fn)
}
