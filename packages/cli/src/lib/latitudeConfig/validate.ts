import Ajv from 'ajv'
import type { ErrorObject } from 'ajv'

// TODO: Load from ./schemas/v1.schema.json
import configSchema from './configSchema'
import { LATITUDE_CONFIG_FILE } from '../../commands/constants'

const ajv = new Ajv({ useDefaults: true, allErrors: true })

export type ValidationReturn<T extends unknown> = {
  valid: boolean
  data: T
  errors: {
    errors: ErrorObject[]
    message: string
  }
}
export default function validateFn<T extends unknown>(
  data: T,
): ValidationReturn<T> {
  const validate = ajv.compile(configSchema)

  const valid = validate(data)

  const errors = validate.errors ?? ([] as ErrorObject[])
  return {
    errors: {
      message: `Invalid ${LATITUDE_CONFIG_FILE}`,
      errors,
    },
    valid,
    data,
  }
}
