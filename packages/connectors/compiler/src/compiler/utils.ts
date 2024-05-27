import { QueryMetadata } from './types'

export function mergeMetadata(...metadata: QueryMetadata[]): QueryMetadata {
  const config = metadata.reduce((acc, m) => ({ ...acc, ...m.config }), {})
  const methods = metadata.reduce(
    (acc, m) => new Set([...acc, ...m.methods]),
    new Set<string>(),
  )

  return {
    config,
    methods,
  }
}

export function emptyMetadata(): QueryMetadata {
  return {
    config: {},
    methods: new Set<string>(),
  }
}
