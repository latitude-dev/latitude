import middlewareQueryStore from './shared/middlewareQueryStore'
import {
  InlineParam,
  InlineParams,
  QuerySubscriptionOptions,
  useQuery,
} from './hooks'
import { QueryResultArray } from '@latitude-data/query_result'
import { QueryResultState } from '@latitude-data/client'
import { Readable, derived, get } from 'svelte/store'
import { browser } from '$app/environment'
import { fetchQueryFromCore } from './shared/api'
import { loaded } from './shared/utils'
import { ViewParams } from '../viewParams'

/**
 * runQuery returns a store with a promise that resolves to the query result, which is returned as an array of row hashes.
 * This method is targeted for easier use in Svelte pages made by users.
 */
export function runQuery(
  query: string,
  inlineParams: InlineParams = {},
  opts: QuerySubscriptionOptions = {}
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
    }
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
          queryPaths.length === 0 || queryPaths.includes(queryInView.queryPath)
      )
      .map((queryInView) =>
        fetchQueryFromCore({
          query: queryInView.queryPath,
          inlineParams: queryInView.inlineParams,
          force,
          skipIfParamsUnchanged,
        })
      )
  )
}

export const input = (key: string, defaultValue?: unknown): InlineParam => ({
  key: `input(${key})`,
  callback: (viewParams: ViewParams) =>
    key in viewParams ? viewParams[key] : defaultValue,
})

/**
 * To avoid requesting multiple fetch requests to the server while the page is
 * loading and the params are still being added while the document loads, we
 * need to wait for the page to be fully loaded before fetching the queries.
 *
 * TODO: Find a better way to detect when the page is fully loaded without having
 * to manually call init() in the page.
 */
export function init() {
  loaded.set(true)

  return computeQueries({
    queryPaths: [],
    force: false,
    skipIfParamsUnchanged: false,
  })
}
