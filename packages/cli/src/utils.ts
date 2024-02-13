import path from 'path'
import fs from 'fs'
import { Handler } from 'sade'

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

export const setDebugMode: Handler = (args) => {
  if (!args.debug) return

  // FIXME: Implement a config system and put debug mode there
  delete args.debug

  return args
}
