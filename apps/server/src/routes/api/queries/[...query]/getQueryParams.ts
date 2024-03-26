import { FORCE_REFETCH_PARAMETER, TOKEN_PARAM } from '@latitude-data/client'
import castValue, { IValue } from './castValue'

export default function getQueryParams(url: URL) {
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
