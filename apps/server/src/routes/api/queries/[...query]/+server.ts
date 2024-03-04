import handleError from '$lib/errors/handler'
import findOrCompute from '$lib/query_service/find_or_compute'

const FORCE_PARAM = '__force'

export async function GET({
  params,
  url,
}: {
  params: { query: string }
  url: URL
}) {
  const { query } = params
  const { params: queryParams, force } = getQueryParams(url)

  try {
    const queryResult = await findOrCompute({ query, queryParams, force })

    return new Response(queryResult.toJSON(), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (e) {
    return handleError(e as Error)
  }
}

type IValue = string | number | boolean

function getQueryParams(url: URL) {
  const searchParams = url.searchParams
  const params: { [key: string]: IValue } = {}
  for (const [key, value] of searchParams) {
    if (key !== FORCE_PARAM) {
      params[key] = castValue(value)
    }
  }

  return { params, force: searchParams.get(FORCE_PARAM) === 'true' }
}

function castValue(value: string) {
  if (value === 'true') return true
  if (value === 'false') return false
  if (!isNaN(Number(value))) return Number(value)

  return value
}
