import findQueryFile from './findQueryFile'
import { createConnector } from '@latitude-data/connector-factory'
import cache from './query_cache'

type Props = {
  query: string
  queryParams: Record<string, unknown>
  force: boolean
}

export default async function findOrCompute({
  query,
  queryParams,
  force,
}: Props) {
  const { sourcePath } = await findQueryFile(query)
  const connector = createConnector(sourcePath)
  const { compiledQuery, resolvedParams } = await connector.compileQuery({
    queryPath: query,
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
