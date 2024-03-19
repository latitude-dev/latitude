import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getProjectSource } from './project'
import mockFs from 'mock-fs'
import * as path from 'path'
import * as vscode from 'vscode'

vi.mock('vscode', () => ({
  Uri: {
    file: vi.fn((path: string) => ({ fsPath: path })),
  },
}))

describe('getProjectSource', () => {
  beforeEach(() => {
    mockFs({
      '/project/withConfig': {
        'file.txt': '',
        'latitude.json': '{ "key": "value" }',
      },
      '/project/withConfig/nested': {
        'nestedFile.txt': '',
      },
      '/project/withoutConfig': {
        'file.txt': '',
      },
      '/project/nestedProject/inner': {
        'latitude.json': '{ "key": "value" }',
        'file.txt': '',
      },
    })
  })

  afterEach(() => {
    mockFs.restore()
  })

  const vscodeUri = (filepath: string) =>
    vscode.Uri.file(path.resolve(filepath))

  it('returns the directory if latitude.json is present in the given directory', () => {
    const result = getProjectSource(
      vscodeUri('/project/nestedProject/inner/file.txt'),
    )
    expect(result).toBe(path.resolve('/project/nestedProject/inner'))
  })

  it('returns the directory if latitude.json is present in the directory of the given file', () => {
    const result = getProjectSource(vscodeUri('/project/withConfig/file.txt'))
    expect(result).toBe(path.resolve('/project/withConfig'))
  })

  it('returns the directory of latitude.json if it is present in a parent directory', () => {
    const result = getProjectSource(
      vscodeUri('/project/withConfig/nested/nestedFile.txt'),
    )
    expect(result).toBe(path.resolve('/project/withConfig'))
  })

  it('returns undefined if latitude.json is not present in the given directory or any parent directory', () => {
    const result = getProjectSource(
      vscodeUri('/project/withoutConfig/file.txt'),
    )
    expect(result).toBe(undefined)
  })

  it('returns undefined even if latitude.json is present in a child directory, but not in a parent directory', () => {
    const result = getProjectSource(vscodeUri('/project/nestedProject'))
    expect(result).toBe(undefined)
  })
})
