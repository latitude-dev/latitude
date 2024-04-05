import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useQuery } from './useQuery'
import {
  createWrapper,
  dummyWrapper,
  mockServerRequest,
} from '$src/tests/utils'
import { DataType } from '@latitude-data/query_result'

const USERS = {
  fields: [
    { name: 'id', type: DataType.String },
    { name: 'name', type: DataType.String },
    { name: 'email', type: DataType.String },
  ],
  rows: [
    [1, 'John Doe', 'jon@doe.com'],
    [2, 'Jane Doe', 'jane@doe.com'],
  ],
  rowCount: 2,
}

describe('useQuery', () => {
  it('returns a successful response', async () => {
    mockServerRequest({ path: 'some/path/users', payload: USERS })

    const { result } = renderHook(
      () => useQuery({ queryPath: 'some/path/users' }),
      { wrapper: createWrapper() },
    )
    expect(result.current.isPlaceholderData).toBe(true)
    await waitFor(() =>
      expect(result.current.data).toMatchObject({
        fields: [
          { name: 'id', type: DataType.String },
          { name: 'name', type: DataType.String },
          { name: 'email', type: DataType.String },
        ],
        rows: [
          [1, 'John Doe', 'jon@doe.com'],
          [2, 'Jane Doe', 'jane@doe.com'],
        ],
        rowCount: 2,
      }),
    )
    expect(result.current.isPlaceholderData).toBe(false)
  })

  it('fails to load when not using provider', async () => {
    mockServerRequest({ path: 'some/path/users' })
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      //do nothing
    })

    expect(() => {
      renderHook(() => useQuery({ queryPath: 'some/path/users' }), {
        wrapper: dummyWrapper(),
      })
    }).toThrow(Error('No QueryClient set, use QueryClientProvider to set one'))

    errorSpy.mockRestore()
  })

  it('computes query', async () => {
    mockServerRequest({
      path: 'some/path/users',
      payload: {
        fields: [
          { name: 'id', type: DataType.String },
          { name: 'name', type: DataType.String },
          { name: 'email', type: DataType.String },
        ],
        rows: [],
        rowCount: 0,
      },
    })
    const { result } = renderHook(
      () => useQuery({ queryPath: 'some/path/users' }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.data).toMatchObject({
        fields: [
          { name: 'id', type: DataType.String },
          { name: 'name', type: DataType.String },
          { name: 'email', type: DataType.String },
        ],
        rows: [],
        rowCount: 0,
      })
    })

    let wasForced = false
    mockServerRequest({
      path: 'some/path/users',
      payload: USERS,
      callback: (forced) => {
        // Inspect the callback to see if the fetch was forced
        wasForced = forced
      },
    })

    // Refetch data forcing it
    result.current.compute()

    await waitFor(() => {
      expect(result.current.data).toMatchObject(USERS)
    })
    expect(wasForced).toBe(true)
  })

  it('handle a server 500 error when compute is run', async () => {
    mockServerRequest({
      path: 'some/path/users',
      status: 500,
    })

    const { result } = renderHook(
      () => useQuery({ queryPath: 'some/path/users' }),
      { wrapper: createWrapper() },
    )

    mockServerRequest({
      path: 'some/path/users',
      payload: USERS, // This won't be loaded because of the 500 error
      status: 500,
    })

    // Refetch data forcing it
    result.current.compute()

    await waitFor(() => {
      expect(result.current.data).toMatchObject({
        fields: [],
        rows: [],
        rowCount: 0,
      })
    })
  })
})
