import handleError from '$lib/errors/handler'
import findOrCompute from '$lib/query_service/find_or_compute'
import getQueryParams from './getQueryParams'

type Props = { params: { query?: string }; url: URL }

export async function GET({ params: args, url }: Props) {
  try {
    const { params, force, download } = await getQueryParams(url)
    const query = args.query ?? ''
    const { queryResult, compiledQuery } = await findOrCompute({
      query,
      queryParams: params,
      force,
    })
    const ttl = compiledQuery.config.ttl
    let headers = {}
    if (ttl) {
      headers = { 'Cache-Control': `private, max-age=${ttl}` }
    }

    if (download) {
      return new Response(queryResult.toCSV(), {
        headers: {
          ...headers,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${
            query ?? 'query'
          }.csv"`,
        },
        status: 200,
      })
    } else {
      return new Response(queryResult.toJSON(), {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        status: 200,
      })
    }
  } catch (e) {
    return handleError(e as Error)
  }
}
