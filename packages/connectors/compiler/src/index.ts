import { Compiler, ConfigFn, ResolveFn, type SupportedMethod } from './compiler'

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
    supportedMethods,
    resolveFn,
    configFn,
  }).compile()
}

export { default as CompileError } from './error/error'
export { type SupportedMethod } from './compiler'
