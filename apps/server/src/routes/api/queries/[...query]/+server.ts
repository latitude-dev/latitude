import { handleQueryError } from '$lib/errors/handler'
import findOrCompute from '$lib/query_service/find_or_compute'
import getQueryParams from './getQueryParams'

type Props = { params: { query?: string }; url: URL }

export async function GET({ params: args, url }: Props) {
  try {
    const { params, force, download } = await getQueryParams(url)
    const query = args.query ?? ''
    const { queryResult } = await findOrCompute({
      query,
      queryParams: params,
      force,
    })

    if (download) {
      return new Response(queryResult.toCSV(), {
        headers: {
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
          'Content-Type': 'application/json',
        },
        status: 200,
      })
    }
  } catch (e) {
    return handleQueryError(e as Error)
  }
}
