import { describe, it, expect, afterEach } from 'vitest'
import { Dirent } from 'fs'
import * as fs from 'fs/promises'
import { vi } from 'vitest'
import findQueryFile, { QueryNotFoundError, SourceFileNotFoundError } from '.'

const ROOT_FOLDER = 'path/to/queries'

// Mocks fs module
vi.mock('fs/promises', () => ({
  access: vi.fn(),
  readdir: vi.fn(),
}))

describe('findQueryFile', () => {
  const mockFilePath = 'subfolder/query'
  const mockSourcePath = `${ROOT_FOLDER}/subfolder/source.yml`

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return the correct paths if the query file and source file exist', async () => {
    vi.mocked(fs.access).mockResolvedValue() // Pretend the file exists
    vi.mocked(fs.readdir).mockResolvedValue([
      'source.yml' as unknown as Dirent,
      'anotherfile.txt' as unknown as Dirent,
    ])

    const result = await findQueryFile(ROOT_FOLDER, mockFilePath)

    expect(result).toEqual({
      queryPath: 'query.sql',
      sourcePath: mockSourcePath,
    })
  })

  it('should throw a QueryNotFoundError if the .sql file does not exist', async () => {
    vi.mocked(fs.access).mockRejectedValue(new Error('File not found'))

    await expect(findQueryFile(ROOT_FOLDER, mockFilePath)).rejects.toThrow(
      QueryNotFoundError,
    )
  })

  it('should throw a SourceFileNotFoundError if the .yml file does not exist', async () => {
    vi.mocked(fs.access).mockResolvedValue() // Pretend the SQL file exists
    vi.mocked(fs.readdir).mockResolvedValue([
      'anotherfile.txt' as unknown as Dirent,
    ]) // Pretending there's no YML file

    await expect(findQueryFile(ROOT_FOLDER, mockFilePath)).rejects.toThrow(
      SourceFileNotFoundError,
    )
  })
})
