import { createQueryKey, store } from '@latitude-data/client'
import { computeQueryParams, createMiddlewareKey, loaded } from './utils'
import { get } from 'svelte/store'
import middlewareQueryStore, {
  MiddlewareStoreState,
} from './middlewareQueryStore'
import { browser } from '$app/environment'
import { InlineParams } from '../hooks'

/**
 * Updates the middlewareQueryStore for a given queryPath and inlineParams.
 * If the query is already in the store and resolves to the same parameters as before, it does nothing.
 * Otherwise, it fetches it from the core query store (which fetches it from the server if not already in that store).
 * If force is true, it forces a refetch of the query from the server.
 */
export async function fetchQueryFromCore({
  query,
  inlineParams,
  force = false,
  skipIfParamsUnchanged = true,
}: {
  query: string
  inlineParams: InlineParams
  force?: boolean // Adds the 'force' flag to the request, to invalidate the backend cache
  skipIfParamsUnchanged?: boolean // If true, it won't refetch if the params haven't changed
}): Promise<void> {
  const queryKey = createMiddlewareKey(query, inlineParams)
  const computedParams = computeQueryParams(inlineParams)
  const coreQueryKey = createQueryKey(query, computedParams)

  const oldQueryKey = get(middlewareQueryStore)[queryKey]?.coreQueryKey

  middlewareQueryStore.update((state: MiddlewareStoreState) => ({
    ...state,
    [queryKey]: { queryPath: query, inlineParams, coreQueryKey },
  }))

  if (!browser || !loaded.get()) return // Don't fetch queries until the page is fully loaded
  if (skipIfParamsUnchanged && oldQueryKey === coreQueryKey) return // Don't refetch if there have been no changes to the params

  if (force) {
    store.getState().forceRefetch({ queryPath: query, params: computedParams })
  } else {
    store.getState().fetch({ queryPath: query, params: computedParams })
  }
}
