import colors from 'picocolors'
import path from 'path'
import fsExtra from 'fs-extra'
import fs from 'fs'
import { OnErrorProps } from './types'

/**
 * This ASCII log is generated using the following website:
 * https://patorjk.com/software/taag/#p=display&h=0&v=0&f=Larry%203D&t=Latitude
 */
export async function getLatitudeBanner(): Promise<string | null> {
  const logoPath = path.join(__dirname, '../latitude-banner.txt')
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
  await fsExtra.ensureDir(path.dirname(target))
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

export function onError({ error, message, color = 'red' }: OnErrorProps) {
  const colorFn = color === 'red' ? colors.red : colors.yellow
  console.error(colorFn(`${message} \nERROR:\n${error}`))
  process.exit(1)
}

export const cleanTerminal = () => {
  process.stdout.write('\x1bc')
}
