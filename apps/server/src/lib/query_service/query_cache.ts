import CacheManager from '$lib/cache_manager'
import QueryResult from '@latitude-data/query_result'
import { QueryRequest } from '@latitude-data/source-manager'

class QueryCache {
  private cache: CacheManager

  constructor() {
    this.cache = new CacheManager()
  }

  public find({ queryPath, params }: QueryRequest, ttl?: number) {
    const json = this.cache.find(this.createKey({ queryPath, params }), ttl)
    if (!json) return null

    return QueryResult.fromJSON(json)
  }

  public set({ queryPath, params }: QueryRequest, queryResult: QueryResult) {
    this.cache.set(this.createKey({ queryPath, params }), queryResult.toJSON())
  }

  private createKey({ queryPath, params }: QueryRequest) {
    return `${queryPath}__${Object.entries(params ?? {})
      .map(([key, value]) => `${key}=${value}`)
      .join('__')}`
  }
}

export default new QueryCache()
