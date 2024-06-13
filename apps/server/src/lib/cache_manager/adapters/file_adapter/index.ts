import storage from '$lib/server/storageDriver'
import Adapter from './adapter'
import { createHash } from 'crypto'

const CACHE_DIR_IN_STORAGE = 'cache'

export default class FileAdapter extends Adapter {
  constructor() {
    super()
  }

  public async get(key: string, ttl?: number) {
    try {
      const filepath = `${CACHE_DIR_IN_STORAGE}/${this.getHashedKey(key)}`
      if (!(await storage.exists(filepath))) return null

      if (ttl) {
        // Time to live for the cache (in seconds)
        const stats = await storage.stat(filepath)
        if (Date.now() - stats.mtimeMs > ttl * 1000) {
          return null
        }
      }

      return await storage.read(filepath, 'utf8')
    } catch (error) {
      // @ts-expect-error - Error type doesn't have a code property
      if (error.code === 'ENOENT') return null

      throw error
    }
  }

  public set(key: string, value: string | Blob) {
    const filepath = `${CACHE_DIR_IN_STORAGE}/${this.getHashedKey(key)}`
    return storage.write(filepath, value.toString())
  }

  private getHashedKey(key: string) {
    return createHash('sha256').update(key).digest('hex')
  }
}
