import mockFs from 'mock-fs'
import { vi, describe, it, expect } from 'vitest'
import { SourceManager, DiskDriver } from '@latitude-data/source-manager'
import { BASE_STATIC_PATH, MATERIALIZE_DIR, QUERIES_DIR } from '$lib/constants'
import { buildSourceManager } from '$lib/server/sourceManager'

vi.mock('@latitude-data/source-manager', async (importOriginal) => {
  const original = (await importOriginal()) as typeof importOriginal
  return {
    ...original,
    SourceManager: vi.fn(),
  }
})

describe('buildSourceManager', () => {
  it('should return a new SourceManager instance', () => {
    mockFs({
      [BASE_STATIC_PATH]: {
        'latitde.json': `{
          "materialize": {
            "storage": {
              "type": "disk",
             }
          }
        }`,
        'query.sql': 'SELECT * FROM table',
      },
    })

    buildSourceManager()
    expect(SourceManager).toHaveBeenCalledWith(QUERIES_DIR, {
      materialize: {
        Klass: DiskDriver,
        config: { path: MATERIALIZE_DIR },
      },
    })
  })

  it('fallbacks to disk driver when weird config', () => {
    mockFs({
      [BASE_STATIC_PATH]: {
        'latitde.json': `{
          "materialize": {
            "storage": {
              "type": "weird",
             }
          }
        }`,
        'query.sql': 'SELECT * FROM table',
      },
    })

    buildSourceManager()
    expect(SourceManager).toHaveBeenCalledWith(QUERIES_DIR, {
      materialize: {
        Klass: DiskDriver,
        config: { path: MATERIALIZE_DIR },
      },
    })
  })

  it('fallbacks to disk driver when latitude.json does not exist', () => {
    mockFs({
      [BASE_STATIC_PATH]: {
        'query.sql': 'SELECT * FROM table',
      },
    })
    buildSourceManager()
    expect(SourceManager).toHaveBeenCalledWith(QUERIES_DIR, {
      materialize: {
        Klass: DiskDriver,
        config: { path: MATERIALIZE_DIR },
      },
    })
  })
})
