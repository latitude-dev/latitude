import { browser } from '$app/environment'
import {
  store as queryStore,
  createQueryKey as createKeyForQueryStore,
  type QueryResultState,
} from '@latitude-data/client'
import { writable, get, derived, Readable } from 'svelte/store'
import { ViewParams, getAllViewParams, useViewParams } from './viewParams'
import { type QueryResultArray } from '@latitude-data/query_result'
import { debounce } from 'lodash-es'

let loaded = false

// TODO: Refactor this madness

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
  const sanitizedViewParams = sanitizeParams(viewParams)
  const composedParams = composeParams(inlineParams, viewParams)

  return { ...sanitizedViewParams, ...composedParams }
}

function sanitizeParams(
  params: Record<string, unknown>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined),
  )
}

function composeParams(
  inlineParams: InlineParams,
  viewParams: Record<string, unknown>,
): Record<string, unknown> {
  return Object.entries(inlineParams).reduce<Record<string, unknown>>(
    (accumulatedParams, [key, inlineParam]) => {
      const paramValue = resolveParamValue(inlineParam, viewParams)
      if (paramValue !== undefined) {
        accumulatedParams[key] = paramValue
      }
      return accumulatedParams
    },
    {},
  )
}

function resolveParamValue(
  inlineParam: unknown,
  viewParams: Record<string, unknown>,
): unknown {
  if (
    typeof inlineParam === 'object' &&
    inlineParam !== null &&
    'callback' in inlineParam
  ) {
    return (
      inlineParam as {
        callback: (viewParams: Record<string, unknown>) => string
      }
    ).callback(viewParams)
  }
  return inlineParam
}

function createMiddlewareKey(
  queryPath: string,
  inlineParams: InlineParams = {},
): string {
  const hashedParams = Object.keys(inlineParams)
    .sort()
    .map(
      (paramName) =>
        `${paramName}=${
          inlineParams[paramName].key ?? String(inlineParams[paramName])
        }`,
    )
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
  skipIfParamsUnchanged = true,
}: {
  query: string
  inlineParams: InlineParams
  force?: boolean // Adds the 'force' flag to the request, to invalidate the backend cache
  skipIfParamsUnchanged?: boolean // If true, it won't refetch if the params haven't changed
}): Promise<void> {
  const queryKey = createMiddlewareKey(query, inlineParams)
  const computedParams = computeQueryParams(inlineParams)
  const coreQueryKey = createKeyForQueryStore(query, computedParams)

  const oldQueryKey = get(middlewareQueryStore)[queryKey]?.coreQueryKey

  middlewareQueryStore.update((state: MiddlewareStoreState) => ({
    ...state,
    [queryKey]: { queryPath: query, inlineParams, coreQueryKey },
  }))

  if (!browser || !loaded) return // Don't fetch queries until the page is fully loaded
  if (skipIfParamsUnchanged && oldQueryKey === coreQueryKey) return // Don't refetch if there have been no changes to the params

  if (force) {
    queryStore
      .getState()
      .forceRefetch({ queryPath: query, params: computedParams })
  } else {
    queryStore.getState().fetch({ queryPath: query, params: computedParams })
  }
}

export type QuerySubscriptionOptions = {
  reactToParams?: boolean | number
  reactiveToParams?: boolean | number // Deprecated
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
    queryResultStore.set({
      ...queryResultState,
      data: queryResultState.data ?? get(queryResultStore).data,
    })
  }
  // Update state when coreQueryKey changes
  coreQueryKeyStore.subscribe(updateState)

  // Check for state updates when queryStore changes
  queryStore.subscribe(updateState)

  if (opts.reactiveToParams) {
    console.warn(
      'The "reactiveToParams" option is deprecated. Please use "reactToParams" instead.',
    )
  }

  const reactive = opts.reactiveToParams ?? opts.reactToParams

  // Refetch when viewParams change
  if (reactive || reactive === 0) {
    const debounceTime = reactive === true ? 0 : reactive
    const debouncedRefetch = debounce(() => {
      fetchQueryFromCore({ query, inlineParams })
    }, debounceTime)

    useViewParams().subscribe(() => {
      const newComputedParams = computeQueryParams(inlineParams)
      const newCoreQueryKey = createKeyForQueryStore(query, newComputedParams)
      if (
        debounceTime === 0 ||
        newCoreQueryKey in queryStore.getState().queries
      ) {
        fetchQueryFromCore({ query, inlineParams })
        return
      }
      debouncedRefetch()
    })
  }

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

export async function computeQueries({
  queryPaths = [],
  force = true,
  skipIfParamsUnchanged = false,
}: {
  queryPaths: string[]
  force?: boolean
  skipIfParamsUnchanged?: boolean
}): Promise<void[]> {
  if (!browser) return []

  const queriesInView = get(middlewareQueryStore)
  return Promise.all(
    Object.values(queriesInView)
      .filter(
        (queryInView) =>
          queryPaths.length === 0 || queryPaths.includes(queryInView.queryPath),
      )
      .map((queryInView) =>
        fetchQueryFromCore({
          query: queryInView.queryPath,
          inlineParams: queryInView.inlineParams,
          force,
          skipIfParamsUnchanged,
        }),
      ),
  )
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
  return computeQueries({
    queryPaths: [],
    force: false,
    skipIfParamsUnchanged: false,
  })
}
