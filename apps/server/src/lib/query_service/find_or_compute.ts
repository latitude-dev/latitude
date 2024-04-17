import cache from './query_cache'
import sourceManager from '$lib/server/sourceManager'

type Props = {
  query: string
  queryParams: Record<string, unknown>
  force: boolean
}

export const QUERIES_DIR = 'static/.latitude/queries'

export default async function findOrCompute({
  query,
  queryParams,
  force,
}: Props) {
  const source = await sourceManager.loadFromQuery(query)
  const compiledQuery = await source.compileQuery({
    queryPath: query,
    params: queryParams,
  })

  const request = {
    queryPath: compiledQuery.sql,
    params: compiledQuery.accessedParams, // Only cache the params that were accessed, not all the params passed in
  }

  const compute = async () => {
    const queryResult = await source.runCompiledQuery(compiledQuery)
    cache.set(request, queryResult)
    return queryResult
  }

  if (force) {
    return compute()
  }

  const queryResult = cache.find(request, compiledQuery.config.ttl)
  if (queryResult) return queryResult
  return compute()
}
