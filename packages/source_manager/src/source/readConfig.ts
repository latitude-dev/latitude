import fs from 'fs'
import yaml from 'yaml'
import { SourceSchema, SourceFileNotFoundError } from '@/types'
import { resolveSecrets } from '@/utils'

export class InvalidSourceConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidSourceConfigError'
  }
}

export default function readSourceConfig(sourcePath: string): SourceSchema {
  if (!fs.existsSync(sourcePath)) {
    throw new SourceFileNotFoundError(`Source file not found at ${sourcePath}`)
  }

  const file = fs.readFileSync(sourcePath, 'utf8')
  const config = resolveSecrets({
    unresolvedSecrets: yaml.parse(file),
  }) as unknown as SourceSchema

  // Validation requirements
  if (!config?.type) {
    throw new InvalidSourceConfigError(`Missing 'type' in configuration`)
  }

  if (typeof config.type !== 'string') {
    throw new InvalidSourceConfigError(`Invalid 'type' in configuration`)
  }

  return config
}
