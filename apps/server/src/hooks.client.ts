import { computeQueries } from '$lib/stores/queries'

if (import.meta.hot) {
  import.meta.hot.on('refetch-queries', (payload) => {
    const { queries } = payload
    computeQueries({
      queryPaths: queries,
      force: true,
      skipIfParamsUnchanged: false,
    })
  })
}
