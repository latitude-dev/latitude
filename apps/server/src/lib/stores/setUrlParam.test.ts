import { replaceState } from '$app/navigation'
import { setUrlParam, ViewParams } from './viewParams'
import { describe, it, expect, vi } from 'vitest'

vi.mock('$app/navigation', () => ({
  replaceState: vi.fn(),
}))

describe('setUrlParam', () => {
  it('should call replaceState with correct parameters', () => {
    const newParams: ViewParams = {
      foo: 'bar',
      baz: undefined,
      qux: null,
      quux: '',
    }
    setUrlParam(newParams)

    expect(replaceState).toHaveBeenCalledWith('?foo=$text:bar', {})
  })

  it('it shows clean url when no params', () => {
    setUrlParam({ foo: '' })

    expect(replaceState).toHaveBeenCalledWith('', {})
  })

  it('should not throw an error if replaceState is not available', () => {
    // Simulate the scenario where replaceState throws an error
    vi.mocked(replaceState).mockImplementationOnce(() => {
      throw new Error('replaceState not available')
    })

    expect(() => setUrlParam({ foo: 'bar' })).not.toThrow()
  })
})
