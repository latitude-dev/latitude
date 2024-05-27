import { RichDate } from '@latitude-data/custom_types'

export type IValue = string | number | boolean | Date | null | Array<IValue>

export default function castValue(value: unknown): IValue {
  // TODO: Make this function an actual service with proper testing
  if (value === 'true') return true
  if (value === 'false') return false

  if (value instanceof RichDate) return value.resolve()
  if (!isNaN(Number(value))) return Number(value)

  if (Array.isArray(value)) {
    return value.map(castValue)
  }

  return value as IValue
}
