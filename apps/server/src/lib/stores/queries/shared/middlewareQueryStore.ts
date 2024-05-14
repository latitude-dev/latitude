import { writable } from 'svelte/store'
import { InlineParams } from '../hooks'

/**
 * The middlewareQueryStore is a store that keeps track of the queries being
 * used in the current view, and points to the key in the core query store with
 * the results for each query, which will change when the viewParams change.
 */
export type MiddlewareStoreState = Record<
  string,
  {
    queryPath: string
    inlineParams: InlineParams
    coreQueryKey: string // key in the core query store
  }
>
export const middlewareQueryStore = writable<MiddlewareStoreState>({})

export default middlewareQueryStore
