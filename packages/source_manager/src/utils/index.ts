export function resolveSecrets({
  unresolvedSecrets,
}: {
  unresolvedSecrets: Record<string, unknown>
}) {
  return Object.entries(unresolvedSecrets).reduce(
    (acc, [key, value]) => {
      if (typeof value === 'object') {
        acc[key] = resolveSecrets({
          unresolvedSecrets: value as Record<string, unknown>,
        })
        return acc
      }

      if (typeof value === 'string' && value.startsWith('LATITUDE__')) {
        if (process.env[value]) {
          acc[key] = process.env[value]
          return acc
        }

        throw new Error(
          `Invalid configuration. Environment variable ${value} was not found in the environment.`,
        )
      }

      acc[key] = value
      return acc
    },
    {} as Record<string, unknown>,
  )
}
