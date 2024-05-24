export type SupportedMethod = <T extends boolean>(
  interpolation: T,
  ...args: unknown[]
) => Promise<T extends true ? string : unknown>

export type ResolveFn = (value: unknown) => Promise<string>
export type ConfigFn = (key: string, value: unknown) => void

export type CompilerAttrs = {
  query: string
  resolveFn: ResolveFn
  configFn: ConfigFn
  supportedMethods?: Record<string, SupportedMethod>
}

export type CompileContext = {
  sql: string // Full original query
  supportedMethods: Record<string, SupportedMethod> // Supported methods by the connector
  resolveFn: ResolveFn // Resolves a value to a string that can be injected in the query
  configFn: ConfigFn // Sets a configuration value for the query
}
