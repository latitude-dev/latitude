import cache from './query_cache'
import sourceManager from '$lib/server/sourceManager'
import QueryResult from '@latitude-data/query_result'
import { CompiledQuery } from '@latitude-data/base-connector'
import computeRelativeQueryPath from './computeRelativeQueryPath'

type Props = {
  query: string
  queryParams: Record<string, unknown>
  force: boolean
}

export default async function findOrCompute({
  query,
  queryParams,
  force,
}: Props): Promise<{
  queryResult: QueryResult
  compiledQuery: CompiledQuery
}> {
  const { source, sourceFilePath } = await sourceManager.loadFromQuery(query)
  const compiledQuery = await source.compileQuery({
    queryPath: computeRelativeQueryPath({
      queryPath: query,
      sourcePath: sourceFilePath,
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
      cache.find(request, compiledQuery.config.ttl) || (await compute())
  }

  return {
    queryResult,
    compiledQuery,
  }
}
