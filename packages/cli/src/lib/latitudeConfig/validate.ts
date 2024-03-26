import Ajv from 'ajv'
import schema from '../../lib/v1.schema.json'
import { LATITUDE_CONFIG_FILE } from '$src/commands/constants'

import type { ErrorObject } from 'ajv'

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
  const validate = ajv.compile(schema)
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
