import handleError from '$lib/errors/handler'
import findOrCompute from '$lib/query_service/find_or_compute'
import getEncryptedParams from './getEncryptedParams'
import getQueryParams from './getQueryParams'

type Props = { params: { query?: string }; url: URL }
export async function GET({ params: args, url }: Props) {
  const { query } = args
  try {
    const { params, force } = getQueryParams(url)
    const encrypted = await getEncryptedParams({ url })
    const queryParams = { ...params, ...encrypted }
    const queryResult = await findOrCompute({
      query: query ?? '',
      queryParams,
      force,
    })

    return new Response(queryResult.toJSON(), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (e) {
    return handleError(e as Error)
  }
}
