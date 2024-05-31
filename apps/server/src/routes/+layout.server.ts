import loadToken from '$lib/loadToken'
import type { LayoutServerLoad } from './$types'
import { get } from 'svelte/store'
import { config, fliterClientConfig } from '$lib/stores/config'

export const load: LayoutServerLoad = async ({ url }) => {
  return {
    ...(await loadToken({ url })),
    config: fliterClientConfig(get(config)),
  }
}
