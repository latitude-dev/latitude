import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useQuery } from './useQuery'
import { createWrapper } from '$src/tests/utils'

const mockDownloadQuery = vi.fn()

vi.mock('$src/data/LatitudeProvider', async (importOriginal) => ({
  ...((await importOriginal()) as Record<string, unknown>),
  useLatitude: () => ({ api: { downloadQuery: mockDownloadQuery } }),
}))

describe('useQuery', () => {
  it('downloads query', async () => {
    const queryPath = 'some/path/users'
    const params = { someParam: 'value' }

    const { result } = renderHook(() => useQuery({ queryPath, params }), {
      wrapper: createWrapper(),
    })

    await waitFor(async () => {
      const download = result.current.download
      await download()

      expect(mockDownloadQuery).toHaveBeenCalledWith({
        queryPath,
        params: { ...params, __force: false },
      })
    })
  })

  it('downloads query with force', async () => {
    const queryPath = 'some/path/users'
    const params = { someParam: 'value' }

    const { result } = renderHook(() => useQuery({ queryPath, params }), {
      wrapper: createWrapper(),
    })

    await waitFor(async () => {
      const download = result.current.download
      await download({ force: true })

      expect(mockDownloadQuery).toHaveBeenCalledWith({
        queryPath,
        params: { ...params, __force: true },
      })
    })
  })
})
