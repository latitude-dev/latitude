import CacheManager from '$lib/cache_manager'
import QueryResult from '@latitude-data/query_result'
import { ResolvedParam } from '../../../../../packages/connectors/base/dist'

class QueryCache {
  private cache: CacheManager

  constructor() {
    this.cache = new CacheManager()
  }

  public find({ query, params }: { query: string; params: ResolvedParam[] }) {
    const json = this.cache.find(this.createKey({ query, params }))
    if (!json) return null

    return QueryResult.fromJSON(json)
  }

  public set(
    { query, params }: { query: string; params: ResolvedParam[] },
    queryResult: QueryResult,
  ) {
    this.cache.set(this.createKey({ query, params }), queryResult.toJSON())
  }

  private createKey({
    query,
    params,
  }: {
    query: string
    params: ResolvedParam[]
  }) {
    return `${query}::${params.map((param) => param.value).join('::')}`
  }
}

export default new QueryCache()
