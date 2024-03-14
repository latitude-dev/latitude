import { describe, it, expect, vi, beforeEach } from 'vitest'
import { syncQueriesAndCsvs } from '.'
import path from 'path'
import syncFiles from '../shared/syncFiles'

vi.mock('path', () => ({
  ...vi.importActual('path'), // Import actual path module functionalities
  default: {
    join: vi.fn(), // Mock `path.join`
    relative: vi.fn(),
  },
}))

vi.mock('../shared/syncFiles', () => ({
  default: vi.fn(),
}))

describe('syncQueriesAndCsvs', () => {
  let fakeRootDir: string
  let destinationCsvsDir: string
  let destinationQueriesDir: string

  beforeEach(() => {
    // Reset mocks and set up test variables
    vi.resetAllMocks()

    fakeRootDir = '/fake/rootDir'
    destinationCsvsDir = '/dest/csvs'
    destinationQueriesDir = '/dest/queries'

    // @ts-expect-error - mock
    ;(path.relative as unknown as vi.Mock).mockImplementation(
      (_: string, srcPath: string) =>
        srcPath.replace(/^\/fake\/rootDir\/queries\/?/, ''),
    )
    // @ts-expect-error - mock
    ;(path.join as unknown as vi.Mock).mockImplementation((...args: any[]) =>
      args.join('/'),
    )
  })

  it('should handle .csv files correctly', () => {
    const sync = syncQueriesAndCsvs({
      rootDir: fakeRootDir,
      destinationCsvsDir,
      destinationQueriesDir,
    })
    const srcPath = `${fakeRootDir}/queries/some/path/myfile.csv`
    const expectedDestPath = `${destinationCsvsDir}/some/path/myfile.csv`

    sync(srcPath, 'add', true)

    expect(syncFiles).toHaveBeenCalledWith({
      srcPath,
      destPath: expectedDestPath,
      relativePath: 'some/path/myfile.csv',
      type: 'add',
      ready: true,
    })
  })

  it('should handle .sql files correctly', () => {
    const sync = syncQueriesAndCsvs({
      rootDir: fakeRootDir,
      destinationCsvsDir,
      destinationQueriesDir,
    })
    const srcPath = `${fakeRootDir}/queries/some/path/myfile.sql`
    const expectedDestPath = `${destinationQueriesDir}/some/path/myfile.sql`

    sync(srcPath, 'add', true)

    expect(syncFiles).toHaveBeenCalledWith({
      srcPath,
      destPath: expectedDestPath,
      relativePath: 'some/path/myfile.sql',
      type: 'add',
      ready: true,
    })
  })
})
