import { format as formatDate, parse as parseDate } from 'date-fns'

export enum RelativeDate {
  TODAY = '_TODAY_',
  YESTERDAY = '_YESTERDAY_',
  TOMORROW = '_TOMORROW_',
}

export class RichDate {
  constructor(
    public value: Date | RelativeDate,
    public format: string,
  ) {}

  static fromString(formattedValue: string, format: string): RichDate {
    if (Object.values(RelativeDate).includes(formattedValue as RelativeDate)) {
      return new RichDate(formattedValue as RelativeDate, format)
    }

    const date = parseDate(formattedValue, format, new Date())
    return new RichDate(date, format)
  }

  toString(): string {
    if (this.value instanceof Date) return formatDate(this.value, this.format)
    return this.value
  }

  resolve(): Date {
    if (this.value instanceof Date) return this.value

    if (this.value === RelativeDate.TODAY) return new Date()
    if (this.value === RelativeDate.YESTERDAY)
      return new Date(Date.now() - 24 * 60 * 60 * 1000)
    if (this.value === RelativeDate.TOMORROW)
      return new Date(Date.now() + 24 * 60 * 60 * 1000)

    return new Date()
  }
}

enum ValueType {
  NULL = 'null',
  TEXT = 'text',
  NUM = 'num',
  BOOL = 'bool',
  DATE = 'date',
}

export function format(value: unknown): string {
  if (value instanceof Date) value = new RichDate(value, 'yyyy-MM-dd')

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
    return `$${ValueType.DATE}:${encodeURIComponent(
      value.toString(),
    )}:${encodeURIComponent(value.format)}`
  }

  return encodeURIComponent(String(value))
}

export function parse(value: string): unknown {
  if (!value.startsWith('$')) return decodeURIComponent(value)

  const [type, ...rest] = value.slice(1).split(':')
  if (!Object.values(ValueType).includes(type as ValueType)) return decodeURIComponent(value)
  if (type === ValueType.NULL) return null

  if (rest.length === 0) return value // Value not specified

  if (type === ValueType.TEXT) return decodeURIComponent(rest.join(':'))
  if (type === ValueType.NUM) return Number(rest.join(':'))
  if (type === ValueType.BOOL) return rest.join(':') === 'true'
  if (type === ValueType.DATE) {
    const date = decodeURIComponent(rest[0]!)
    const format = rest.length > 1 ? decodeURIComponent(rest[1]!) : 'yyyy-MM-dd'
    return RichDate.fromString(date, format)
  }

  return decodeURIComponent(value) // Unhandled type
}
