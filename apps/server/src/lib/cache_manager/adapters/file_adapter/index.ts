import Adapter from './adapter'
import fs from 'fs'
import { createHash } from 'crypto'

const CACHE_ROOT = process.env['LATITUDE_PROJECT_ROOT'] || '/tmp'

export default class FileAdapter extends Adapter {
  private root: string

  constructor(root: string = CACHE_ROOT) {
    super()

    this.root = `${root}/.latitude`

    if (!fs.existsSync(this.root)) {
      fs.mkdirSync(this.root)
    }
  }

  public get(key: string, ttl?: number) {
    try {
      if (ttl) {
        // Time to live for the cache (in seconds)
        const stats = fs.statSync(`${this.root}/${this.getHashedKey(key)}`)
        if (Date.now() - stats.mtimeMs > ttl * 1000) {
          return null
        }
      }
      return fs.readFileSync(`${this.root}/${this.getHashedKey(key)}`, 'utf8')
    } catch (error) {
      // @ts-expect-error - Error type doesn't have a code property
      if (error.code === 'ENOENT') return null

      throw error
    }
  }

  public set(key: string, value: string | Blob) {
    return fs.writeFileSync(
      `${this.root}/${this.getHashedKey(key)}`,
      value.toString(),
    )
  }

  private getHashedKey(key: string) {
    return createHash('sha256').update(key).digest('hex')
  }
}
