import { it, describe, expect } from 'vitest'
import { QUERIES_DIR } from '$lib/server/sourceManager'
import computeRelativeQueryPath from './computeRelativeQueryPath'

describe('computeRelativeQueryPath', () => {
  it('should compute the relative query path correctly', () => {
    const sourcePath = `${QUERIES_DIR}/folder/source.yml`
    const queryPath = 'folder/query.sql'
    const result = computeRelativeQueryPath({ sourcePath, queryPath })
    expect(result).toBe('query.sql')
  })

  it('should compute the relative query path correctly if query is nested in subfolders', () => {
    const sourcePath = `${QUERIES_DIR}/folder/source.yml`
    const queryPath = 'folder/subfolder/query.sql'
    const result = computeRelativeQueryPath({ sourcePath, queryPath })
    expect(result).toBe('subfolder/query.sql')
  })

  it('should compute the relative query path correctly if query is in root directory', () => {
    const sourcePath = `${QUERIES_DIR}/source.yml`
    const queryPath = 'query.sql'
    const result = computeRelativeQueryPath({ sourcePath, queryPath })
    expect(result).toBe('query.sql')
  })

  it('should compute the relative query path correctly if source is in root directory and query is in subfolders', () => {
    const sourcePath = `${QUERIES_DIR}/source.yml`
    const queryPath = 'folder/subfolder/query.sql'
    const result = computeRelativeQueryPath({ sourcePath, queryPath })
    expect(result).toBe('folder/subfolder/query.sql')
  })
})
