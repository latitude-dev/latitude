import cache from './query_cache'
import sourceManager, { QUERIES_DIR } from '$lib/server/sourceManager'
import QueryResult from '@latitude-data/query_result'
import { CompiledQuery } from '@latitude-data/base-connector'
import path from 'path'

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

export function computeRelativeQueryPath({
  sourcePath, // /static/.latitude/queries/folder/source.yml
  queryPath, // folder/query.sql
}: {
  sourcePath: string
  queryPath: string
}) {
  const base = path
    .dirname(sourcePath) // /static/.latitude/queries/folder
    .slice(sourcePath.indexOf(QUERIES_DIR) + QUERIES_DIR.length + 1) // folder

  if (!base) return queryPath

  return queryPath.slice(queryPath.indexOf(base) + base.length + 1) // query.sql
}
