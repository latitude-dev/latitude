import FileAdapter from './adapters/file_adapter'

export default class CacheManager {
  private adapter

  constructor(adapter = new FileAdapter()) {
    this.adapter = adapter
  }

  public async find(key: string, ttl?: number) {
    return this.adapter.get(key, ttl)
  }

  public async set(key: string, value: string | Blob) {
    this.adapter.set(key, value)
  }
}
