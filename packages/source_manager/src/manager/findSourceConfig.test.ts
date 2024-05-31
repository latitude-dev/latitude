import { vi, describe, it, expect, afterEach } from 'vitest'

import findSourceConfigFromQuery from './findSourceConfig'
import { QUERIES_DIR } from '@/tests/helper'

describe('findSourceConfigFromQuery', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('finds source path for query', async () => {
    const result = findSourceConfigFromQuery({
      queriesDir: QUERIES_DIR,
      query: 'valid-source/query',
    })
    const sourcePath = `${QUERIES_DIR}/valid-source/source.yml`
    expect(result).toEqual(sourcePath)
  })

  it('finds correct source config from nested query', async () => {
    const sourcePath = `${QUERIES_DIR}/valid-source/nestedSource/source.yml`
    const nestedResult = findSourceConfigFromQuery({
      queriesDir: QUERIES_DIR,
      query: 'valid-source/nestedSource/query',
    })

    expect(nestedResult).toEqual(sourcePath)
  })

  it('finds correct nexted source config from nested query', async () => {
    const veryNestedResult = findSourceConfigFromQuery({
      queriesDir: QUERIES_DIR,
      query: 'valid-source/nestedSource/secondNested/query',
    })

    expect(veryNestedResult).toEqual(
      `${QUERIES_DIR}/valid-source/nestedSource/secondNested/two_levels_nested_source.yml`,
    )
  })

  it('throw error if .sql query not found', async () => {
    expect(() =>
      findSourceConfigFromQuery({
        queriesDir: QUERIES_DIR,
        query: 'valid/nonexistent',
      }),
    ).toThrow(`Query file not found at ${QUERIES_DIR}/valid/nonexistent.sql`)
  })

  it('throw error if source.yml is not found', async () => {
    expect(() =>
      findSourceConfigFromQuery({
        queriesDir: QUERIES_DIR,
        query: 'invalid-source/query',
      }),
    ).toThrow(
      `Source file not found at ${QUERIES_DIR}/invalid-source/query.sql`,
    )
  })
})
