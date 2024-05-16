import { computeQueries } from '$lib/stores/queries'
import { config } from '$lib/stores/config'

if (import.meta.hot) {
  // plugins/queriesWatcher.ts
  import.meta.hot.on('refetch-queries', (payload) => {
    const { queries } = payload
    computeQueries({
      queryPaths: queries,
      force: true,
      skipIfParamsUnchanged: false,
    })
  })

  // plugins/configWatcher.ts
  import.meta.hot.on('client-config-update', (payload) => {
    config.set(payload)
  })
}
