import QueryResult from '@latitude-data/query_result'
import { type CompiledQuery, type Source } from '@latitude-data/source-manager'
import cache from './query_cache'
import computeRelativeQueryPath from './computeRelativeQueryPath'

export default async function findOrCompute({
  source,
  query,
  queryParams,
  force,
}: {
  source: Source
  query: string
  queryParams: Record<string, unknown>
  force: boolean
}): Promise<{
  queryResult: QueryResult
  compiledQuery: CompiledQuery
}> {
  const compiledQuery = await source.compileQuery({
    queryPath: computeRelativeQueryPath({
      queryPath: query,
      sourcePath: source.path,
    }),
    params: queryParams,
  })

  const request = {
    queryPath: compiledQuery.sql,
    params: compiledQuery.accessedParams,
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
      cache.find(request, compiledQuery.config?.ttl) || (await compute())
  }

  return {
    queryResult,
    compiledQuery,
  }
}
