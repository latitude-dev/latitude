import { it, describe, expect, vi } from 'vitest'
import fs from 'fs'
import SourceManager from '@/manager'
import * as factory from '@/baseConnector/connectorFactory'
import { QUERIES_DIR, ROOT_DIR } from '@/tests/helper'

describe('SourceManager', () => {
  it('does not load the same connector twice', async () => {
    const readFileSpy = vi.spyOn(fs, 'readFileSync')
    const factorySpy = vi.spyOn(factory, 'default')
    const query1Path = 'valid-source/query'
    const query2Path = 'valid-source/nested/query'
    const sourceManager = new SourceManager(QUERIES_DIR)
    const source1 = await sourceManager.loadFromQuery(query1Path)
    const source2 = await sourceManager.loadFromQuery(query2Path)

    expect(readFileSpy).toHaveBeenCalledOnce()
    expect(source1).toBe(source2)

    await source1.compileQuery({ queryPath: 'valid-source/query' })
    await source1.compileQuery({ queryPath: 'valid-source/nested/query' })
    expect(factorySpy).toHaveBeenCalledOnce()
  })
})

describe('loadFromQuery', () => {
  it('finds and loads the source from a query in a nested directory with a source file', async () => {
    const sourceManager = new SourceManager(QUERIES_DIR)
    const source = await sourceManager.loadFromQuery('valid-source/query')
    const nestedSource = await sourceManager.loadFromQuery(
      'valid-source/nestedSource/query',
    )

    expect(source).toBeDefined()
    expect(nestedSource).toBeDefined()
    expect(source).not.toBe(nestedSource)
  })

  it('throws an error if the query file does not exist', async () => {
    const sourceManager = new SourceManager(QUERIES_DIR)

    await expect(
      sourceManager.loadFromQuery('nonexistent'),
    ).rejects.toThrowError(
      `Query file not found at ${QUERIES_DIR}/nonexistent.sql`,
    )
  })

  it('throws an error if the query is not in the queries directory', async () => {
    const sourceManager = new SourceManager(QUERIES_DIR)
    await expect(
      sourceManager.loadFromQuery('../nopQuery'),
    ).rejects.toThrowError(
      `Query file is not in the queries directory: ${ROOT_DIR}/nopQuery.sql`,
    )
  })
})

describe('loadFromConfigFile', () => {
  it('finds and loads the source from a source configuration file', async () => {
    const sourceManager = new SourceManager(QUERIES_DIR)
    const source = await sourceManager.loadFromConfigFile(
      'valid-source/source.yml',
    )

    expect(source).toBeDefined()
  })

  it('throws an error if the source file does not exist', async () => {
    const sourceManager = new SourceManager(QUERIES_DIR)
    await expect(
      sourceManager.loadFromConfigFile('nonexistent.yml'),
    ).rejects.toThrowError(
      `Source file not found at ${QUERIES_DIR}/nonexistent.yml`,
    )
  })

  it('throws an error if the source file is not in the queries directory', async () => {
    const sourceManager = new SourceManager(QUERIES_DIR)

    await expect(
      sourceManager.loadFromConfigFile('/source.yml'),
    ).rejects.toThrowError('Source file not found at /source.yml')
  })

  it('loads the same source configuration file only once', async () => {
    const sourceManager = new SourceManager(QUERIES_DIR)
    const source1 = await sourceManager.loadFromConfigFile(
      'valid-source/source.yml',
    )
    const source2 = await sourceManager.loadFromConfigFile(
      'valid-source/source.yml',
    )

    expect(source1).toBe(source2)
  })

  it('loads different source configuration files separately', async () => {
    const sourceManager = new SourceManager(QUERIES_DIR)
    const source1 = await sourceManager.loadFromConfigFile(
      'valid-source/source.yml',
    )
    const source2 = await sourceManager.loadFromConfigFile(
      'valid-source/nestedSource/source.yml',
    )
    expect(source1).not.toBe(source2)
  })
})
