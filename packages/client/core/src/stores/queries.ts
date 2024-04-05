import { createStore } from 'zustand/vanilla'
import { api } from '../data/api'
import QueryResult, { QueryResultPayload } from '@latitude-data/query_result'

type QueryRequest = {
  queryPath: string
  params?: Record<string, unknown>
}

export type QueryParams = Record<string, unknown>
export const createQueryKey = (
  queryPath: string,
  params: QueryParams,
): string => {
  const hashedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${String(params[key])}`)
    .join('&')
  return `query:${queryPath}?${hashedParams}`
}

export interface QueryResultState {
  isLoading: boolean
  data?: QueryResult | null
  error?: Error | null
}

interface StoreState {
  queries: Record<string, QueryResultState>
  fetch: (request: QueryRequest) => Promise<void>
  forceRefetch: (request: QueryRequest) => Promise<void>
}

export const store = createStore<StoreState>((set, get) => {
  const performQueryFetch = async (
    queryKey: string,
    fetchFn: () => Promise<QueryResultPayload>,
  ) => {
    set((state) => ({
      queries: {
        ...state.queries,
        [queryKey]: {
          ...(state.queries[queryKey] || {}),
          isLoading: true,
          error: null,
        },
      },
    }))

    try {
      const response = await fetchFn()
      const data = new QueryResult({
        fields: response.fields,
        rows: response.rows,
        rowCount: response.rowCount,
      })

      set((state) => ({
        queries: {
          ...state.queries,
          [queryKey]: { data, isLoading: false, error: null },
        },
      }))
    } catch (error) {
      set((state) => ({
        queries: {
          ...state.queries,
          [queryKey]: {
            data: null,
            isLoading: false,
            error:
              error instanceof Error ? error : new Error('An error occurred'),
          },
        },
      }))
    }
  }

  return {
    queries: {},
    fetch: async ({ queryPath, params }) => {
      const queryKey = createQueryKey(queryPath, params || {})
      if (get().queries[queryKey]) return

      performQueryFetch(queryKey, async () =>
        api.getQuery({ queryPath, params, force: false }),
      )
    },
    forceRefetch: async ({ queryPath, params }) => {
      const queryKey = createQueryKey(queryPath, params || {})
      performQueryFetch(queryKey, async () =>
        api.getQuery({ queryPath, params, force: true }),
      )
    },
  }
})

export const useFetchQuery = (queryPath: string, params: QueryParams) => {
  const queryKey = createQueryKey(queryPath, params)
  const state = store.getState()

  if (!state.queries[queryKey]) {
    state.fetch({ queryPath, params })
  }

  return store.subscribe((state) => state.queries[queryKey])
}

export const useRunQuery = (queryPath: string, params: QueryParams) => {
  store.getState().forceRefetch({ queryPath, params })
}
