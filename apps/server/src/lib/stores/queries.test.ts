import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useQuery, init as initQueries } from './queries'
import { type ViewParams } from './viewParams'
import { get, Writable, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid';

// @ts-expect-error - This imported functions are defined in the mock below, but not in the actual file
import { resetQueryState, mockFetchFn } from '@latitude-data/client'
import { setViewParam } from './viewParams'

vi.mock('$app/environment', () => {
  return {
    browser: true
  }
})

type MockQueryState = {
  queries: Record<string, unknown>
  forceRefetch: (request: unknown) => Promise<void>
  fetch: (request: unknown) => Promise<void>
}

vi.mock('@latitude-data/client', () => {
  const mockFetchFn = vi.fn(async () => {})
  const initialQueryState: MockQueryState = {
    queries: {},
    forceRefetch: mockFetchFn,
    fetch: mockFetchFn,
  }
  let queryState: Writable<MockQueryState>
  
  return {
    store: {
      subscribe: vi.fn((subscription) => {
        return queryState.subscribe(subscription)
      }),
      getState: vi.fn(() => get(queryState)),
      update: vi.fn((updater) => {
        queryState.update(updater)
      }),
    },
    createQueryKey: (queryPath: string, params: Record<string, unknown>): string => {
      return queryPath + JSON.stringify(params)
    },
    resetQueryState: () => {
      queryState = writable(initialQueryState)
      mockFetchFn.mockReset()
    },
    mockFetchFn,
  }
})

let mockViewParams: Writable<ViewParams>

vi.mock('./viewParams', () => {
  return {
    useViewParams: () => mockViewParams,
    getAllViewParams: vi.fn(() => get(mockViewParams)),
    setViewParam: vi.fn((key: string, value: unknown) => {
      mockViewParams.update((params) => {
        params[key] = value
        return params
      })
    })
  }
})

initQueries() // Initialize the queries store. Otherwise the fetch function would never be called

describe('useQuery with reactiveParams', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    resetQueryState()
    mockViewParams = writable<ViewParams>({})
  })

  it('should not run the refetch function when reactiveParams is not set', () => {
    // Subscribe to a query
    const query = uuidv4()
    const opts = { reactiveToParams: false }
    useQuery({ query, opts })

    // The 'fetch' method should be called once when the query is first subscribed
    expect(mockFetchFn).toHaveBeenCalledTimes(1)

    // Update the viewParams
    setViewParam('param', 'value')
    vi.runAllTimers()

    // The 'fetch' method should not have been called again
    expect(mockFetchFn).toHaveBeenCalledTimes(1)
  })

  it('should re-run the refetch function each time the parameters change when reactiveParams is set to true', () => {
    // Subscribe to a query
    const query = uuidv4()
    const opts = { reactiveToParams: true }
    useQuery({ query, opts })

    // The 'fetch' method should be called once when the query is first subscribed
    expect(mockFetchFn).toHaveBeenCalledTimes(1)

    // Update the viewParams
    setViewParam('param', 'value1')
    setViewParam('param', 'value2')
    setViewParam('param', 'value3')
    setViewParam('param', 'value4')
    vi.runAllTimers()

    // The 'fetch' method should have been called the 1 initial time + 4 times when the viewParams were updated
    expect(mockFetchFn).toHaveBeenCalledTimes(5)
  })

  it('should re-run the refetch function only when the debounce time has passed when reactiveParams is set to a number', () => {
    // Subscribe to a query
    const query = uuidv4()
    const opts = { reactiveToParams: 100 } // 100ms debounce time
    useQuery({ query, opts })
    vi.runAllTimers()

    // The 'fetch' method should be called once when the query is first subscribed
    expect(mockFetchFn).toHaveBeenCalledTimes(1)

    // Update the viewParams multiple times
    setViewParam('param', 'value1')
    setViewParam('param', 'value2')
    setViewParam('param', 'value3')
    setViewParam('param', 'value4')
    vi.runAllTimers()

    // The 'fetch' method should have been called the 1 initial time + 1 time after the debounce time has passed
    expect(mockFetchFn).toHaveBeenCalledTimes(2)
  })
})
