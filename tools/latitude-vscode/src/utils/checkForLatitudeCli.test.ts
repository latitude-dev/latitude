import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as vscode from 'vscode'
import { checkForLatitudeCli } from './checkForLatitudeCli'

let execFn: () => string = () => ''

const setCommandResult = (result: string | Error) => {
  execFn = () => {
    if (result instanceof Error) throw result
    return result
  }
}

vi.mock('child_process', () => ({
  execSync: vi.fn().mockImplementation(() => execFn()),
}))

vi.mock('vscode', () => ({
  window: {
    showErrorMessage: vi
      .fn()
      .mockImplementation(() => Promise.resolve(undefined)),
  },
  env: {
    openExternal: vi.fn(),
  },
  Uri: {
    parse: vi.fn(),
  },
}))

describe('checkForLatitudeCli', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return true when @latitude-data/cli is installed', () => {
    setCommandResult('@latitude-data/cli')

    expect(checkForLatitudeCli()).toBe(true)
    expect(vscode.window.showErrorMessage).not.toHaveBeenCalled()
  })

  it('should return false and show error message when @latitude-data/cli is not installed', () => {
    setCommandResult('some-other-package')

    expect(checkForLatitudeCli()).toBe(false)
    expect(vscode.window.showErrorMessage).toHaveBeenCalledOnce()
  })

  it('should return false and show error message when execSync throws an error', () => {
    setCommandResult(new Error('Command failed'))

    expect(checkForLatitudeCli()).toBe(false)
    expect(vscode.window.showErrorMessage).toHaveBeenCalledOnce()
  })
})
