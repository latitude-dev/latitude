import cache from './query_cache'
import sourceManager from '$lib/server/sourceManager'
import QueryResult from '@latitude-data/query_result'
import { CompiledQuery } from '@latitude-data/base-connector'

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
}: Props): Promise<{
  queryResult: QueryResult
  compiledQuery: CompiledQuery
}> {
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

  let queryResult
  if (force) {
    queryResult = await compute()
  } else {
    queryResult =
      cache.find(request, compiledQuery.config.ttl) || (await compute())
  }

  return {
    queryResult,
    compiledQuery,
  }
}
