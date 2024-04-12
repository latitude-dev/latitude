import { iframe } from '@latitude-data/embedding'
import { setViewParams } from '$lib/stores/viewParams'
import { computeQueries } from '$lib/stores/queries'

/*
 * FIXME: Get list of allowed origins from `latitude.json`
 */
export function initIframeCommunication({
  allowedOrigins,
}: {
  allowedOrigins: string[]
}) {
  iframe.registerAllowedOrigins(allowedOrigins)
  iframe.onParamsRequestChange = (data) => {
    setViewParams(data.params)
  }
  iframe.onRun = (data) => {
    computeQueries(data)
  }

  iframe.listen()

  return iframe
}
