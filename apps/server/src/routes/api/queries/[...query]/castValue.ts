import { RichDate, parse } from '@latitude-data/custom_types'

export type IValue = string | number | boolean | Date | null

export default function castValue(value: string): IValue {
  // TODO: Make this function an actual service with proper testing
  const parsedValue = parse(value)
  if (typeof parsedValue !== 'string') {
    if (parsedValue instanceof RichDate) return parsedValue.resolve()
    return parsedValue as IValue
  }

  if (parsedValue === 'true') return true
  if (parsedValue === 'false') return false
  if (!isNaN(Number(parsedValue))) return Number(parsedValue)

  return parsedValue
}
