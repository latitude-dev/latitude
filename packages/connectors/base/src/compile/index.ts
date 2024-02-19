import { type CompiledQuery } from '../types'
import { type CompileParams, Compiler } from './compiler'

export default function compile({
  queryRequest,
  resolveFn,
  readQueryFn,
  runQueryFn,
}: CompileParams): Promise<CompiledQuery> {
  const { queryPath, params } = queryRequest
  const compiler = new Compiler({
    params: params ?? {},
    resolveFn,
    readQueryFn,
    runQueryFn,
    compiledQueryNames: [],
    resolvedParams: [],
    varStash: [],
  })
  return compiler.compile(queryPath)
}
