import { createStore } from 'zustand/vanilla'
import { api } from '../data/api'
import QueryResult from '@latitude-sdk/query_result'

type QueryRequest = {
  queryPath: string
  params?: Record<string, unknown>
}

export const createQueryKey = (
  queryPath: string,
  params: Record<string, unknown>,
): string => {
  const hashedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${String(params[key])}`)
    .join('&')
  return `query:${queryPath}?${hashedParams}`
}

export interface QueryResultState {
  data?: QueryResult | null
  isLoading: boolean
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
    fetchFn: () => Promise<QueryResult>,
  ) => {
    set((state) => ({
      queries: {
        ...state.queries,
        [queryKey]: { isLoading: true, error: null },
      },
    }))
    try {
      const response = await fetchFn()
      const data = new QueryResult({
        fields: response.fields,
        rows: response.rows,
        rowCount: response.rows?.length,
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

      performQueryFetch(queryKey, async () => {
        const response = await api.get<string>(
          `api/queries/${queryPath}`,
          params,
        )
        return QueryResult.fromJSON(response)
      })
    },
    forceRefetch: async ({ queryPath, params }) => {
      const queryKey = createQueryKey(queryPath, params || {})
      performQueryFetch(queryKey, async () => {
        const response = await api.get<string>(
          `api/queries/${queryPath}`,
          params,
        ) // TODO: Add force parameter or header when backend cache is implemented
        return QueryResult.fromJSON(response)
      })
    },
  }
})

export const useFetchQuery = (
  queryPath: string,
  params: Record<string, unknown> = {},
) => {
  const queryKey = createQueryKey(queryPath, params)
  const state = store.getState()

  if (!state.queries[queryKey]) {
    state.fetch({ queryPath, params })
  }

  return store.subscribe((state) => state.queries[queryKey])
}

export const useRunQuery = (
  queryPath: string,
  params: Record<string, unknown>,
) => {
  store.getState().forceRefetch({ queryPath, params })
}
