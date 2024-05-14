import fs from 'fs'
import yaml from 'yaml'
import { SourceSchema, SourceFileNotFoundError } from '@/types'

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
  const config = yaml.parse(file, (_, value) => {
    // if key starts with 'LATITUDE__', replace it with the environment variable
    if (typeof value === 'string' && value.startsWith('LATITUDE__')) {
      if (process.env[value]) return process.env[value]

      throw new Error(`
      Invalid configuration. Environment variable ${value} was not found in the environment. You can review how to set up secret source credentials in the documentation: https://docs.latitude.so/sources/credentials
      `)
    } else {
      return value
    }
  })

  // Validation requirements
  if (!config?.type) {
    throw new InvalidSourceConfigError(`Missing 'type' in configuration`)
  }

  if (typeof config.type !== 'string') {
    throw new InvalidSourceConfigError(`Invalid 'type' in configuration`)
  }

  return config
}
