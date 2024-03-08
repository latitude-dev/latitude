import { format as formatDate, parse as parseDate } from 'date-fns'

export enum RelativeDate {
  Yesterday = '_YESTERDAY_',
  Today = '_TODAY_',
  Tomorrow = '_TOMORROW_',
}

const defaultDateFormat = 'yyyy-MM-dd'

export class RichDate {
  constructor(
    public value: Date | RelativeDate = new Date(),
    public format: string = defaultDateFormat
  ) {}

  static fromString(formattedValue: string, format: string = defaultDateFormat): RichDate {
    if (Object.values(RelativeDate).includes(formattedValue as RelativeDate)) {
      return new RichDate(formattedValue as RelativeDate, format)
    }

    const date = parseDate(formattedValue, format, new Date())
    return new RichDate(date, format)
  }

  isRelative(): boolean {
    return Object.values(RelativeDate).includes(this.value as RelativeDate)
  }

  toString(): string {
    if (this.value instanceof Date) return formatDate(this.value, this.format)
    return this.value
  }

  resolve(): Date {
    if (this.value instanceof Date) return this.value

    if (this.value === RelativeDate.Today) return new Date()
    if (this.value === RelativeDate.Yesterday)
      return new Date(Date.now() - 24 * 60 * 60 * 1000)
    if (this.value === RelativeDate.Tomorrow)
      return new Date(Date.now() + 24 * 60 * 60 * 1000)

    return new Date()
  }
}