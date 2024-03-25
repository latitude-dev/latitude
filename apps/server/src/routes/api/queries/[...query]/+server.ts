import handleError from '$lib/errors/handler'
import findOrCompute from '$lib/query_service/find_or_compute'
import { RichDate, parse } from '@latitude-data/custom_types'
import { FORCE_REFETCH_PARAMETER, TOKEN_PARAM } from '@latitude-data/client'
import loadToken from '$lib/loadToken'

type IValue = string | number | boolean | Date | null

function castValue(value: string): IValue {
  // TODO: Make this function an actual service with proper testing
  const parsedValue = parse(value)
  if (typeof parsedValue !== 'string') {
    if (parsedValue instanceof RichDate) return parsedValue.resolve()
    return parsedValue as IValue
  }

  if (parsedValue === 'true') return true
  if (parsedValue === 'false') return false
  if (!isNaN(Number(parsedValue))) return Number(parsedValue)

  return parsedValue
}

function getQueryParams(url: URL) {
  const searchParams = url.searchParams
  const params: { [key: string]: IValue } = {}
  for (const [key, value] of searchParams) {
    if (TOKEN_PARAM === key) continue
    params[key] = castValue(value)
  }

  const forceParam = params[FORCE_REFETCH_PARAMETER]
  let force = false
  if (forceParam) {
    force = delete params[FORCE_REFETCH_PARAMETER]
  }

  return { params, force }
}

async function getEncryptedParams({ url }: { url: URL }) {
  const token = await loadToken({ url })

  if (!token.valid) {
    throw new Error(token.errorMessage)
  }

  return (token.token?.payload ?? {}) as Record<string, unknown>
}

type Props = { params: { query?: string }, url: URL }
export async function GET({ params: args, url, }: Props) {
  const { query } = args
  try {
    const { params, force } = getQueryParams(url)
    const encrypted = await getEncryptedParams({ url })
    const queryParams = { ...params, ...encrypted }
    const queryResult = await findOrCompute({
      query: query ?? '',
      queryParams,
      force
    })
    return new Response(queryResult.toJSON(), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (e) {
    return handleError(e as Error)
  }
}
