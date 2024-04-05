import {
  DOWNLOAD_PARAM,
  FORCE_REFETCH_PARAM,
  PRIVATE_PARAMS,
} from '@latitude-data/client'
import castValue, { IValue } from './castValue'
import getEncryptedParams from './getEncryptedParams'

export default async function getQueryParams(url: URL) {
  const searchParams = url.searchParams
  let params: { [key: string]: IValue } = {}

  for (const [key, value] of searchParams) {
    if (PRIVATE_PARAMS.has(key)) continue

    params[key] = castValue(value)
  }

  const privateParams: { [key: string]: IValue } = {}
  for (const key of PRIVATE_PARAMS) {
    if (searchParams.has(key)) {
      privateParams[key] = castValue(searchParams.get(key) as string)
    }
  }

  const encrypted = await getEncryptedParams({ url })
  params = { ...params, ...encrypted }

  return {
    params,
    download: privateParams[DOWNLOAD_PARAM] === true,
    force: privateParams[FORCE_REFETCH_PARAM] === true,
  }
}
