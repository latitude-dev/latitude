import { browser } from '$app/environment'
import { store as queryStore, createQueryKey } from '@latitude-data/client'
import { writable, get, Readable, Writable } from 'svelte/store'
import { ViewParams, useViewParams } from '../viewParams'
import { debounce } from 'lodash-es'
import { computeQueryParams, createMiddlewareKey } from './shared/utils'
import middlewareQueryStore from './shared/middlewareQueryStore'
import { fetchQueryFromCore } from './shared/api'

import type { QueryResultState } from '@latitude-data/client'

export type InlineParams = Record<string, InlineParam>
export type InlineParam = {
  key: string
  callback: (viewParams: ViewParams) => unknown
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

function createQueryResultStore(): Writable<QueryResultState> {
  return writable<QueryResultState>({ isLoading: true })
}

function setupMiddlewareQuerySubscription(
  query: string,
  inlineParams: InlineParams,
  middlewareKey: string
): string {
  if (!get(middlewareQueryStore)[middlewareKey]) {
    fetchQueryFromCore({ query, inlineParams })
  }

  return get(middlewareQueryStore)[middlewareKey]!.coreQueryKey
}

function subscribeToMiddlewareChanges(
  middlewareKey: string,
  coreQueryKeyStore: Writable<string>
): void {
  middlewareQueryStore.subscribe((state) => {
    const currentKey = get(coreQueryKeyStore)
    const newKey = state[middlewareKey].coreQueryKey
    if (newKey !== currentKey) {
      coreQueryKeyStore.set(newKey)
    }
  })
}

function updateState(
  coreQueryKeyStore: Readable<string>,
  queryResultStore: Writable<QueryResultState>
) {
  return () => {
    const coreQueryKey = get(coreQueryKeyStore)
    const currentQueryResultState = get(queryResultStore)
    const queryStoreResult = queryStore.getState().queries[coreQueryKey]

    if (!queryStoreResult || queryStoreResult === currentQueryResultState)
      return

    queryResultStore.set({
      ...queryStoreResult,
      data: queryStoreResult.data ?? currentQueryResultState.data,
    })
  }
}

function subscribeToUpdateState(
  coreQueryKeyStore: Readable<string>,
  queryResultStore: Writable<QueryResultState>
): void {
  coreQueryKeyStore.subscribe(updateState(coreQueryKeyStore, queryResultStore))
  queryStore.subscribe(updateState(coreQueryKeyStore, queryResultStore))
}

function handleParamReactivity(
  query: string,
  inlineParams: InlineParams,
  reactToParamsOption: boolean | number
): void {
  const debounceTime =
    reactToParamsOption === true ? 0 : Number(reactToParamsOption)
  const debouncedRefetch = debounce(() => {
    fetchQueryFromCore({ query, inlineParams })
  }, debounceTime)

  useViewParams().subscribe(() => {
    const newComputedParams = computeQueryParams(inlineParams)
    const newCoreQueryKey = createQueryKey(query, newComputedParams)

    if (debounceTime === 0 || queryStore.getState().queries[newCoreQueryKey]) {
      fetchQueryFromCore({ query, inlineParams })
      return
    }

    debouncedRefetch()
  })
}

function createCoreQueryKeyStore({
  query,
  inlineParams = {},
  middlewareKey,
}: {
  query: string
  inlineParams: InlineParams
  middlewareKey: string
}) {
  return writable<string>(
    setupMiddlewareQuerySubscription(query, inlineParams, middlewareKey)
  )
}

export function useQuery({
  query,
  inlineParams = {},
  opts = {},
}: QueryProps): Writable<QueryResultState> {
  const queryResultStore = createQueryResultStore()
  if (!browser) return queryResultStore

  const middlewareKey = createMiddlewareKey(query, inlineParams)
  const coreQueryKeyStore = createCoreQueryKeyStore({
    query,
    inlineParams,
    middlewareKey,
  })

  subscribeToMiddlewareChanges(middlewareKey, coreQueryKeyStore)
  subscribeToUpdateState(coreQueryKeyStore, queryResultStore)

  if (opts.reactiveToParams !== undefined || opts.reactToParams !== undefined) {
    console.warn(
      'The "reactiveToParams" option is deprecated. Please use "reactToParams" instead.'
    )
    const reactToParams = opts.reactToParams ?? opts.reactiveToParams
    if (reactToParams || reactToParams === 0) {
      // handle "0" as explicit debounce time
      handleParamReactivity(query, inlineParams, reactToParams)
    }
  }

  // Initial update to set the state correctly before returning it.
  updateState(coreQueryKeyStore, queryResultStore)()

  return queryResultStore
}
