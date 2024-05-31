import {
  DOWNLOAD_PARAM,
  FORCE_REFETCH_PARAM,
  PRIVATE_PARAMS,
} from '@latitude-data/client'
import castValue, { IValue } from './castValue'
import getEncryptedParams from './getEncryptedParams'
import { parseFromUrl } from '@latitude-data/custom_types'

export default async function getQueryParams(url: URL) {
  const privateParams: { [key: string]: IValue } = {}

  const parsedParams = parseFromUrl(url.search)
  const params = Object.entries(parsedParams).reduce(
    (acc, [key, value]) => {
      const castedValue = castValue(value)
      if (PRIVATE_PARAMS.has(key)) privateParams[key] = castedValue
      else acc[key] = castedValue
      return acc
    },
    {} as Record<string, IValue>,
  )

  const encrypted = await getEncryptedParams({ url })

  return {
    params: { ...params, ...encrypted },
    download: privateParams[DOWNLOAD_PARAM] === true,
    force: privateParams[FORCE_REFETCH_PARAM] === true,
  }
}
