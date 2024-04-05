import { Compiler, ResolveFn, type SupportedMethod } from './compiler'

export type CompileParams = {
  query: string
  resolveFn: ResolveFn
  supportedMethods?: Record<string, SupportedMethod>
}

export default function compile({
  query,
  supportedMethods,
  resolveFn,
}: CompileParams): Promise<string> {
  return new Compiler({
    query,
    supportedMethods,
    resolveFn,
  }).compile()
}

export { default as CompileError } from './error/error'
export { type SupportedMethod } from './compiler'
