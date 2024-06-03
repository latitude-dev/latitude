import React, { useCallback, useEffect, useState } from 'react'
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

export type AppProps = {
  queriesDir: string
  sourceManager: SourceManager
  query: string
  params?: Record<string, unknown>
  watch?: boolean
  debug?: boolean
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

  const [startTime, setStartTime] = useState<number>(Date.now())
  const [elapsedTime, setElapsedTime] = useState<number>(0)

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
      </Box>
    </Box>
  )
}
