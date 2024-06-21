import fs from 'fs'
import yaml from 'yaml'
import { ModelSchema, ModelFileNotFoundError } from '$/types'
import { resolveSecrets } from '@latitude-data/source-manager'

export class InvalidModelConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidModelConfigError'
  }
}

export default function readModelConfig(modelPath: string): ModelSchema {
  if (!fs.existsSync(modelPath)) {
    throw new ModelFileNotFoundError(`Model file not found at ${modelPath}`)
  }

  const file = fs.readFileSync(modelPath, 'utf8')
  const config = resolveSecrets({
    unresolvedSecrets: yaml.parse(file),
  }) as unknown as ModelSchema

  // Validation requirements
  if (!config?.type) {
    throw new InvalidModelConfigError(`Missing 'type' in configuration`)
  }

  if (typeof config.type !== 'string') {
    throw new InvalidModelConfigError(`Invalid 'type' in configuration`)
  }

  return config
}
