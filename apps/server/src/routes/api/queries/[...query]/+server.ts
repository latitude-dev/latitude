import findQueryFile from '$lib/findQueryFile'
import { createConnector } from '@latitude-sdk/connector-factory'
import { json } from '@sveltejs/kit'

export async function GET({
  params,
  url,
}: {
  params: { query: string }
  url: URL
}) {
  const { query } = params

  try {
    const { queryPath, sourcePath } = await findQueryFile(query)
    const connector = createConnector(sourcePath)
    const queryParams = getQueryParams(url)

    try {
      const queryResult = await connector.query({
        queryPath,
        params: queryParams,
      })

      return json(queryResult.toJSON())
    } catch (e) {
      // @ts-ignore
      return new Response(e.message, { status: 500 })
    }
  } catch (e) {
    return new Response((e as Error).message, { status: 404 })
  }
}

type IValue = string | number | boolean

function getQueryParams(url: URL) {
  const searchParams = url.searchParams
  const params: { [key: string]: IValue } = {}
  for (const [key, value] of searchParams) {
    params[key] = castValue(value)
  }

  return params
}

function castValue(value: string) {
  if (value === 'true') return true
  if (value === 'false') return false
  if (!isNaN(Number(value))) return Number(value)

  return value
}
