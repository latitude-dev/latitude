import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import { get, Writable, writable } from 'svelte/store'
import { init as initQueries } from './functions'
import { store } from '@latitude-data/client'
import { useQuery } from './hooks'
import { v4 as uuidv4 } from 'uuid'

// @ts-expect-error - mocking resetviewparams
import { resetViewParams, getAllViewParams, setViewParam } from '../viewParams'

import type { ViewParams } from '../viewParams'

type MockQueryState = {
  queries: Record<string, unknown>
  forceRefetch: (request: unknown) => Promise<void>
  fetch: (request: unknown) => Promise<void>
}

vi.mock('$app/environment', () => {
  return {
    browser: true,
  }
})

const mockFetchFn = vi.hoisted(vi.fn)
const initialQueryState = {
  queries: {},
  forceRefetch: mockFetchFn,
  fetch: mockFetchFn,
}
const resetQueryState = () => {
  mockFetchFn.mockClear()
  // @ts-expect-error - mock types conflict
  store.setState(initialQueryState)
}
vi.mock('@latitude-data/client', () => {
  let queryState: Writable<MockQueryState>

  return {
    store: {
      subscribe: vi.fn((subscription) => {
        return queryState.subscribe(subscription)
      }),
      getState: vi.fn(() => get(queryState)),
      setState: vi.fn((state: MockQueryState) => {
        queryState = writable(state)
      }),
      update: vi.fn((updater) => {
        queryState.update(updater)
      }),
    },
    createQueryKey: (
      queryPath: string,
      params: Record<string, unknown>
    ): string => {
      return queryPath + JSON.stringify(params)
    },
    mockFetchFn,
  }
})

vi.mock('../viewParams', () => {
  let mockViewParams: Writable<ViewParams> = writable({})
  const resetViewParams = () => {
    mockViewParams = writable({}) // Reset to initial state
  }

  return {
    resetViewParams,
    useViewParams: vi.fn(() => mockViewParams),
    getAllViewParams: vi.fn(() => get(mockViewParams)),
    setViewParam: vi.fn((key: string, value: unknown) => {
      mockViewParams.update((params) => {
        params[key] = value
        return params
      })
    }),
  }
})

initQueries() // Initialize the queries store. Otherwise the fetch function would never be called

describe('useQuery with reactiveParams', () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  beforeEach(() => {
    resetQueryState()
    resetViewParams() // Reset the viewParams state explicitly
  })

  it('should not run the refetch function when reactiveParams is not set', () => {
    // Subscribe to a query
    const query = uuidv4()
    const opts = { reactToParams: false }
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
    const opts = { reactToParams: true }
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
    const opts = { reactToParams: 100 } // 100ms debounce time
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

  it('should not include undefined view parameters to run requests', () => {
    setViewParam('foo', undefined)

    const query = uuidv4()
    const opts = { reactToParams: 100 } // 100ms debounce time
    useQuery({ query, opts })
    vi.runAllTimers()

    const lastCallArgs = mockFetchFn.mock.calls[0][0]
    expect(lastCallArgs!.params).toStrictEqual({})
  })

  it('show a console warning when using the deprecated reactiveToParams option', () => {
    // Subscribe to a query
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const query = uuidv4()
    const opts = { reactiveToParams: true }

    useQuery({ query, opts })

    // The 'fetch' method should be called once when the query is first subscribed
    expect(mockFetchFn).toHaveBeenCalledTimes(1)

    // Update the viewParams
    setViewParam('param', 'value')

    vi.runAllTimers()

    // The 'fetch' method should have been called the 1 initial time + 1 time after the viewParams were updated
    expect(mockFetchFn).toHaveBeenCalledTimes(2)

    // The console should have a warning
    expect(consoleSpy).toBeCalledWith(
      'The "reactiveToParams" option is deprecated. Please use "reactToParams" instead.'
    )
  })
})
