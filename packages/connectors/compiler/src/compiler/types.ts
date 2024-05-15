export type SupportedMethod = <T extends boolean>(
  interpolation: T,
  ...args: unknown[]
) => Promise<T extends true ? string : unknown>

export type ResolveFn = (value: unknown) => Promise<string>

export type CompileContext = {
  sql: string // Full original query
  supportedMethods: Record<string, SupportedMethod> // Supported methods by the connector
  resolveFn: ResolveFn // Resolves a value to a string that can be injected in the query
}
type Config = Record<string, unknown>
export type QueryMetadata<T extends Config = Config> = {
  config: T
  methods: Set<string>
}
