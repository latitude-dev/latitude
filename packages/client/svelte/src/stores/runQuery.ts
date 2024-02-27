import { writable } from 'svelte/store'
import type { Readable, Writable } from 'svelte/store'
import { useFetchQuery } from './queries'
import { browser } from '$app/environment'

type QueryResult = {
  [key: string]: unknown
}[]

export function runQuery(
  queryPath: string,
  params: Record<string, unknown> = {},
): Readable<Promise<QueryResult>> {
  const pendingPromise = () => new Promise<QueryResult>(() => {})
  const resolvedPromise = (value: QueryResult) =>
    new Promise<QueryResult>((resolve) => resolve(value))
  const rejectedPromise = (reason?: Error) =>
    new Promise<QueryResult>((_, reject) => reject(reason))

  const promiseStore: Writable<Promise<QueryResult>> =
    writable(pendingPromise())

  if (browser) {
    useFetchQuery(queryPath, params).subscribe(($queryState) => {
      if ($queryState.isLoading) {
        return promiseStore.set(pendingPromise())
      }

      if ($queryState.error) {
        return promiseStore.set(rejectedPromise($queryState.error))
      }

      promiseStore.set(resolvedPromise($queryState.data!.toArray()))
    })
  }

  return {
    subscribe: promiseStore.subscribe,
  }
}
