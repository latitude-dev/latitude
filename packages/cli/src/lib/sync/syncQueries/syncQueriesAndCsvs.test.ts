import { describe, it, expect, vi, beforeEach } from 'vitest'
import { syncQueriesAndCsvs } from './index'
import path from 'path'
import syncFiles from '../shared/syncFiles'

vi.mock('path', () => ({
  ...vi.importActual('path'), // Import actual path module functionalities
  default: {
    join: vi.fn(), // Mock `path.join`
    relative: vi.fn(),
  },
}))

vi.mock('./index', async (importOriginal) => {
  const original = await importOriginal()
  return {
    // @ts-expect-error - mock
    ...original,
    ensureConnectorInstalled: Promise.resolve(true),
  }
})

vi.mock('../shared/syncFiles', () => ({
  default: vi.fn(),
}))

vi.mock('$src/config', () => ({ default: { rootDir: '/fake/rootDir' } }))

let sync: Function
describe('syncQueriesAndCsvs', () => {
  let fakeRootDir: string
  let destinationCsvsDir: string
  let destinationQueriesDir: string

  beforeEach(() => {
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
    sync = syncQueriesAndCsvs({
      destinationCsvsDir,
      destinationQueriesDir,
    })
  })

  it('handle .csv files correctly', async () => {
    const srcPath = `${fakeRootDir}/queries/some/path/myfile.csv`
    const expectedDestPath = `${destinationCsvsDir}/some/path/myfile.csv`
    await sync(srcPath, 'add', true)

    expect(syncFiles).toHaveBeenCalledWith({
      srcPath,
      destPath: expectedDestPath,
      relativePath: 'some/path/myfile.csv',
      type: 'add',
      ready: true,
    })
  })

  it('handle .sql files correctly', async () => {
    const srcPath = `${fakeRootDir}/queries/some/path/myfile.sql`
    const expectedDestPath = `${destinationQueriesDir}/some/path/myfile.sql`
    await sync(srcPath, 'add', true)

    expect(syncFiles).toHaveBeenCalledWith({
      srcPath,
      destPath: expectedDestPath,
      relativePath: 'some/path/myfile.sql',
      type: 'add',
      ready: true,
    })
  })
})
