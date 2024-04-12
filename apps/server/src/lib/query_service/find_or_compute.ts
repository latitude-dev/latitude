import findQueryFile from '@latitude-data/query_service'
import cache from './query_cache'
import path from 'path'
import { loadConnector } from '$lib/server/connectorManager'

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
  const { sourcePath } = await findQueryFile(QUERIES_DIR, query)
  const connector = loadConnector(sourcePath)
  const { compiledQuery, resolvedParams } = await connector.compileQuery({
    queryPath: computeRelativeQueryPath({ sourcePath, queryPath: query }),
    params: queryParams,
  })
  const request = { query: compiledQuery, params: resolvedParams }
  const compute = async () => {
    const queryResult = await connector.runCompiled({
      sql: compiledQuery,
      params: resolvedParams,
    })

    cache.set(request, queryResult)

    return queryResult
  }

  if (force) {
    return compute()
  } else {
    const queryResult = cache.find(request)
    if (queryResult) return queryResult

    return compute()
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
