import { writable } from 'svelte/store'
import {
  store,
  type QueryResultState,
  createQueryKey,
} from '@latitude-sdk/client'

export const useFetchQuery = (
  queryPath: string,
  params: Record<string, unknown> = {},
) => {
  const queryKey = createQueryKey(queryPath, params)
  const queryResult = writable<QueryResultState>({ isLoading: true })

  const unsubscribe = store.subscribe(() => {
    queryResult.set(store.getState().queries[queryKey])
  })

  if (!store.getState().queries[queryKey]) {
    store.getState().fetch({ queryPath, params })
  }

  queryResult.set(store.getState().queries[queryKey])

  return {
    subscribe: queryResult.subscribe,
    unsubscribe,
  }
}
