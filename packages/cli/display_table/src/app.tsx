import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type QueryResult from '@latitude-data/query_result'
import { Box, Spacer, Text, useInput } from 'ink'
import type {
  SourceManager,
  CompiledQuery,
} from '@latitude-data/source-manager'
import chokidar from 'chokidar'
import Spinner from 'ink-spinner'
import Table from './components/Table.js'
import ErrorDisplay from './components/ErrorDisplay.js'
import CompiledQueryDisplay from './components/CompiledQueryDisplay.js'
import { formatElapsedTime } from './utils.js'
import v8 from 'v8'

export type AppProps = {
  queriesDir: string
  sourceManager: SourceManager
  query: string
  params?: Record<string, unknown>
  watch?: boolean
  debug?: boolean
}

function humanizeFileSize(bytes: number) {
  const kb = 1024
  const mb = kb * 1024
  const gb = mb * 1024
  if (bytes < kb) return `${bytes} B`
  if (bytes < mb) return `${(bytes / kb).toFixed(2)} KB`
  if (bytes < gb) return `${(bytes / mb).toFixed(2)} MB`
  return `${(bytes / gb).toFixed(2)} GB`
}

export default function App({
  queriesDir,
  sourceManager,
  query,
  params = {},
  watch = false,
  debug = false,
}: AppProps) {
  const [results, setResults] = useState<QueryResult | null>(null)
  const [compiledQuery, setCompiledQuery] = useState<CompiledQuery | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCompiledQuery, setShowCompiledQuery] = useState(false)
  const [heap, setHeap] = useState(0)
  const [availableMemory, setAvailableMemory] = useState(0)
  const heapTextColor = useMemo(() => {
    const usedMemoryPercentage = heap / availableMemory
    if (usedMemoryPercentage > 0.8) return 'red'
    if (usedMemoryPercentage > 0.5) return 'yellow'
    return 'green'
  }, [heap, availableMemory])

  const [startTime, setStartTime] = useState<number>(Date.now())
  const [elapsedTime, setElapsedTime] = useState<number>(0)

  useEffect(() => {
    const heapLimit = v8.getHeapStatistics().heap_size_limit
    setAvailableMemory(heapLimit)

    const interval = setInterval(() => {
      const currentHeap = v8.getHeapStatistics().used_heap_size
      setHeap(currentHeap)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setStartTime(Date.now())

    setResults(null)
    setCompiledQuery(null)
    setError(null)

    try {
      const source = await sourceManager.loadFromQuery(query)
      const compiledQuery = await source.compileQuery({
        queryPath: query,
        params,
      })

      setCompiledQuery(compiledQuery)
      if (debug) {
        setIsLoading(false)
        return
      }

      const results = await source.runCompiledQuery(compiledQuery)
      setResults(results)
      setIsLoading(false)
    } catch (e) {
      setError(e as Error)
      setIsLoading(false)
    }
  }, [query, params, debug, sourceManager])

  useEffect(() => {
    refresh()

    if (watch) {
      const watcher = chokidar.watch(queriesDir)
      watcher.on('change', refresh)
      return () => {
        watcher.close()
      }
    }
  }, [watch, queriesDir, refresh])

  useInput((input) => {
    if (input === 'r' && !isLoading) refresh()
    if (input === 'd') setShowCompiledQuery(!showCompiledQuery)
  })

  useEffect(() => {
    setElapsedTime(Date.now() - startTime)
    if (isLoading) {
      const interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isLoading, startTime])

  return (
    <Box flexDirection='column' flexGrow={1}>
      <Box flexDirection='row'>
        {isLoading && (
          <Text color='blue'>
            <Spinner />
          </Text>
        )}
        {error && <Text color='red'>✘</Text>}
        {results && <Text color='green'>✓</Text>}
        {debug && compiledQuery && <Text color='blue'>ⓘ</Text>}
        <Box paddingX={2}>
          <Text bold>{query}</Text>
        </Box>
        {results && <Text dimColor>{results.rowCount} rows</Text>}

        <Spacer />
        <Text dimColor={!isLoading}> {formatElapsedTime(elapsedTime)} </Text>
      </Box>

      {(debug || showCompiledQuery) && compiledQuery && (
        <CompiledQueryDisplay compiledQuery={compiledQuery} />
      )}

      {error && (debug || !showCompiledQuery) && <ErrorDisplay error={error} />}

      {results && !showCompiledQuery && <Table data={results} />}

      {isLoading && <Box flexGrow={1} />}
      <Box flexDirection='row'>
        <Text inverse> ↑↓ ←→ to scroll, </Text>
        <Text inverse>R to refresh, </Text>
        {!debug && (
          <Text inverse>
            {showCompiledQuery ? 'D to view results, ' : 'D to view query, '}
          </Text>
        )}
        <Text inverse>Esc / Ctrl+C / Q to exit </Text>
        <Spacer />
        <Text color={heapTextColor}>
          {humanizeFileSize(heap)} / {humanizeFileSize(availableMemory)}
        </Text>
      </Box>
    </Box>
  )
}
