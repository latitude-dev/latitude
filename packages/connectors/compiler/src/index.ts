import { Compiler } from './compiler'
import type { ResolveFn, ConfigFn, SupportedMethod } from './compiler/types'

export type CompileParams = {
  query: string
  resolveFn: ResolveFn
  configFn: ConfigFn
  supportedMethods?: Record<string, SupportedMethod>
}

export default function compile({
  query,
  supportedMethods,
  resolveFn,
  configFn,
}: CompileParams): Promise<string> {
  return new Compiler({
    query,
    supportedMethods: supportedMethods || {},
    resolveFn,
    configFn,
  }).compileSQL()
}

export { default as CompileError } from './error/error'
export type { SupportedMethod } from './compiler/types'
