import { browser } from '$app/environment'
import {
  store as queryStore,
  createQueryKey as createKeyForQueryStore,
  type QueryResultState,
} from '@latitude-sdk/client'
import { writable, get, derived, Readable } from 'svelte/store'
import { ViewParams, getAllViewParams, useViewParams } from './viewParams'
import { type QueryResultArray } from '@latitude-sdk/query_result'

let loaded = false

/**
 * The middlewareQueryStore is a store that keeps track of the queries being
 * used in the current view, and points to the key in the core query store with
 * the results for each query, which will change when the viewParams change.
 */
type MiddlewareStoreState = Record<
  string,
  {
    queryPath: string
    inlineParams: InlineParams
    coreQueryKey: string // key in the core query store
  }
>
const middlewareQueryStore = writable<MiddlewareStoreState>({})

export type InlineParams = Record<string, InlineParam>
type InlineParam = {
  key: string
  callback: (viewParams: ViewParams) => unknown
}

export const input = (key: string, defaultValue?: unknown): InlineParam => ({
  key: `input(${key})`,
  callback: (viewParams: ViewParams) =>
    key in viewParams ? viewParams[key] : defaultValue,
})

function computeQueryParams(
  inlineParams: InlineParams,
): Record<string, unknown> {
  const viewParams = getAllViewParams()
  const params: Record<string, unknown> = { ...viewParams }
  for (const key in inlineParams) {
    params[key] = inlineParams[key].callback(viewParams)
  }
  return params
}

function createMiddlewareKey(
  queryPath: string,
  inlineParams: InlineParams = {},
): string {
  const hashedParams = Object.keys(inlineParams)
    .sort()
    .map((paramName) => `${paramName}=${inlineParams[paramName].key}`)
    .join('&')
  return `query:${queryPath}?${hashedParams}`
}

/**
 * Updates the middlewareQueryStore for a given queryPath and inlineParams.
 * If the query is already in the store and resolves to the same parameters as before, it does nothing.
 * Otherwise, it fetches it from the core query store (which fetches it from the server if not already in that store).
 * If force is true, it forces a refetch of the query from the server.
 */
async function fetchQueryFromCore({
  query,
  inlineParams,
  force = false,
}: {
  query: string
  inlineParams: InlineParams
  force?: boolean
}): Promise<void> {
  const queryKey = createMiddlewareKey(query, inlineParams)
  const computedParams = computeQueryParams(inlineParams)
  const coreQueryKey = createKeyForQueryStore(query, computedParams)

  middlewareQueryStore.update((state: MiddlewareStoreState) => ({
    ...state,
    [queryKey]: { queryPath: query, inlineParams, coreQueryKey },
  }))

  if (!browser || !loaded) return

  if (
    !force &&
    get(middlewareQueryStore)[queryKey] &&
    get(middlewareQueryStore)[queryKey].coreQueryKey == coreQueryKey
  ) {
    return
  }

  if (force) {
    queryStore
      .getState()
      .forceRefetch({ queryPath: query, params: computedParams })
  } else {
    queryStore.getState().fetch({ queryPath: query, params: computedParams })
  }
}

type QuerySubscriptionOptions = {
  reactiveToParams?: boolean
}

export type QueryProps = {
  query: string
  inlineParams?: InlineParams
  opts?: QuerySubscriptionOptions
}

/**
 * useQuery returns a store with the state of the query. The state contains the following properties:
 * - isLoading: boolean
 * - error: Error | null
 * - data: QueryResult | null
 */
export function useQuery({
  query,
  inlineParams = {},
  opts = {},
}: QueryProps): Readable<QueryResultState> {
  const queryResultStore = writable<QueryResultState>({ isLoading: true })
  if (!browser) return queryResultStore

  const middlewareKey = createMiddlewareKey(query, inlineParams)
  if (!get(middlewareQueryStore)[middlewareKey]) {
    fetchQueryFromCore({ query, inlineParams })
  }

  const coreQueryKeyStore = writable<string>(
    get(middlewareQueryStore)[middlewareKey]!.coreQueryKey,
  )
  // Update coreQueryKey when middlewareQueryStore changes
  middlewareQueryStore.subscribe((state) => {
    if (state[middlewareKey].coreQueryKey === get(coreQueryKeyStore)) return
    coreQueryKeyStore.set(state[middlewareKey].coreQueryKey)
  })

  const updateState = () => {
    const coreQueryKey = get(coreQueryKeyStore)
    if (!(coreQueryKey in queryStore.getState().queries)) return
    const queryResultState = queryStore.getState().queries[coreQueryKey]
    if (queryResultState === get(queryResultStore)) return
    queryResultStore.set(queryResultState)
  }

  coreQueryKeyStore.subscribe(updateState) // Update state when coreQueryKey changes
  queryStore.subscribe(updateState) // Check for state updates when queryStore changes
  // Refetch when viewParams change
  if (opts.reactiveToParams)
    useViewParams().subscribe(() => {
      fetchQueryFromCore({ query, inlineParams })
    })

  updateState()

  return queryResultStore
}

/**
 * runQuery returns a store with a promise that resolves to the query result, which is returned as an array of row hashes.
 * This method is targeted for easier use in Svelte pages made by users.
 */
export function runQuery(
  query: string,
  inlineParams: InlineParams = {},
  opts: QuerySubscriptionOptions = {},
): Readable<Promise<QueryResultArray>> {
  const pendingPromise = () => new Promise<QueryResultArray>(() => {})
  const resolvedPromise = (value: QueryResultArray) =>
    new Promise<QueryResultArray>((resolve) => resolve(value))
  const rejectedPromise = (reason?: Error) =>
    new Promise<QueryResultArray>((_, reject) => reject(reason))

  const queryStateToPromise = (queryState: QueryResultState) => {
    if (queryState.isLoading) return pendingPromise()
    if (queryState.error) return rejectedPromise(queryState.error)
    return resolvedPromise(queryState.data!.toArray())
  }

  return derived(
    useQuery({ query, inlineParams, opts }),
    ($queryResultState, set) => {
      set(queryStateToPromise($queryResultState))
    },
  )
}

export async function computeQuery(queryPaths?: string[]): Promise<void> {
  if (!browser) return

  const queriesInView = get(middlewareQueryStore)
  Object.values(queriesInView).map((queryInView) => {
    if (queryPaths && !queryPaths.includes(queryInView.queryPath)) return
    fetchQueryFromCore({
      query: queryInView.queryPath,
      inlineParams: queryInView.inlineParams,
      force: true,
    })
  })
}

/**
 * To avoid requesting multiple fetch requests to the server while the page is
 * loading and the params are still being added while the document loads, we
 * need to wait for the page to be fully loaded before fetching the queries.
 * 
 * TODO: Find a better way to detect when the page is fully loaded without having
 * to manually call init() in the page.
 */
export function init() {
  loaded = true
  computeQuery()
}