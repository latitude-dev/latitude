import { DEFAULT_DATE_FORMAT, RichDate } from './rich_date'

enum ValueType {
  NULL = 'null',
  TEXT = 'text',
  NUM = 'num',
  BOOL = 'bool',
  DATE = 'date',
}

export function format(value: unknown): string {
  if (value instanceof Date) value = new RichDate(value)

  if (value === null) {
    return `$${ValueType.NULL}`
  }
  if (typeof value === 'string') {
    return `$${ValueType.TEXT}:${encodeURIComponent(value)}`
  }
  if (typeof value === 'number') {
    return `$${ValueType.NUM}:${value}`
  }
  if (typeof value === 'boolean') {
    return `$${ValueType.BOOL}:${value ? 'true' : 'false'}`
  }
  if (value instanceof RichDate) {
    const suffix =
      value.format === DEFAULT_DATE_FORMAT
        ? ''
        : `:${encodeURIComponent(value.format)}`
    return `$${ValueType.DATE}:${encodeURIComponent(value.toString())}${suffix}`
  }

  return encodeURIComponent(String(value))
}

export function parse(value: string): unknown {
  if (!value.startsWith('$')) return decodeURIComponent(value)

  const [type, ...rest] = value.slice(1).split(':')
  if (!Object.values(ValueType).includes(type as ValueType))
    return decodeURIComponent(value)
  if (type === ValueType.NULL) return null

  if (rest.length === 0) return value // Value not specified

  if (type === ValueType.TEXT) return decodeURIComponent(rest.join(':'))
  if (type === ValueType.NUM) return Number(rest.join(':'))
  if (type === ValueType.BOOL) return rest.join(':') === 'true'
  if (type === ValueType.DATE) {
    const date = decodeURIComponent(rest[0]!)
    const format =
      rest.length > 1 ? decodeURIComponent(rest[1]!) : DEFAULT_DATE_FORMAT
    return RichDate.fromString(date, format)
  }

  return decodeURIComponent(value) // Unhandled type
}
