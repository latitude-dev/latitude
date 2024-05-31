import {
  addDays,
  addMonths,
  addWeeks,
  format as formatDate,
  parse as parseDate,
  startOfMonth,
  startOfQuarter,
  startOfToday,
  startOfTomorrow,
  startOfWeek,
  startOfYear,
  startOfYesterday,
} from 'date-fns'

export enum RelativeDate {
  Now = '_NOW_',
  Today = '_TODAY_',
  Tomorrow = '_TOMORROW_',
  Yesterday = '_YESTERDAY_',
  OneWeekAgo = '_ONE_WEEK_AGO_',
  TwoWeeksAgo = '_TWO_WEEKS_AGO_',
  OneWeekFromNow = '_ONE_WEEK_FROM_NOW_',
  OneMonthAgo = '_ONE_MONTH_AGO_',
  OneMonthFromNow = '_ONE_MONTH_FROM_NOW_',
  OneYearAgo = '_ONE_YEAR_AGO_',
  StartOfThisWeek = '_START_OF_THIS_WEEK_',
  StartOfNextWeek = '_START_OF_NEXT_WEEK_',
  StartOfLastWeek = '_START_OF_LAST_WEEK_',
  StartOfThisMonth = '_START_OF_THIS_MONTH_',
  StartOfNextMonth = '_START_OF_NEXT_MONTH_',
  StartOfLastMonth = '_START_OF_LAST_MONTH_',
  StartOfThisQuarter = '_START_OF_THIS_QUARTER_',
  StartOfNextQuarter = '_START_OF_NEXT_QUARTER_',
  StartOfLastQuarter = '_START_OF_LAST_QUARTER_',
  StartOfThisYear = '_START_OF_THIS_YEAR_',
  StartOfNextYear = '_START_OF_NEXT_YEAR_',
  StartOfLastYear = '_START_OF_LAST_YEAR_',
  ThreeDaysAgo = '_THREE_DAYS_AGO_',
  ThirtyDaysAgo = '_THIRTY_DAYS_AGO_',
  NinetyDaysAgo = '_NINETY_DAYS_AGO_',
  SixMonthsAgo = '_SIX_MONTHS_AGO_',
}

type RelativeDateResolveFn = () => Date
const RELATIVE_DATE_RESOLVE_FNS: Record<RelativeDate, RelativeDateResolveFn> = {
  [RelativeDate.Now]: () => new Date(),
  [RelativeDate.Today]: () => startOfToday(),
  [RelativeDate.Tomorrow]: () => startOfTomorrow(),
  [RelativeDate.Yesterday]: () => startOfYesterday(),
  [RelativeDate.OneWeekAgo]: () => addWeeks(startOfToday(), -1),
  [RelativeDate.TwoWeeksAgo]: () => addWeeks(startOfToday(), -2),
  [RelativeDate.OneWeekFromNow]: () => addWeeks(startOfToday(), 1),
  [RelativeDate.OneMonthAgo]: () => addMonths(startOfToday(), -1),
  [RelativeDate.OneMonthFromNow]: () => addMonths(startOfToday(), 1),
  [RelativeDate.StartOfThisWeek]: () => startOfWeek(startOfToday()),
  [RelativeDate.StartOfNextWeek]: () =>
    startOfWeek(addWeeks(startOfToday(), 1)),
  [RelativeDate.StartOfLastWeek]: () =>
    startOfWeek(addWeeks(startOfToday(), -1)),
  [RelativeDate.StartOfThisMonth]: () => startOfMonth(startOfToday()),
  [RelativeDate.StartOfNextMonth]: () =>
    startOfMonth(addMonths(startOfToday(), 1)),
  [RelativeDate.StartOfLastMonth]: () =>
    startOfMonth(addMonths(startOfToday(), -1)),
  [RelativeDate.StartOfThisQuarter]: () => startOfQuarter(startOfToday()),
  [RelativeDate.StartOfNextQuarter]: () =>
    startOfQuarter(addMonths(startOfToday(), 3)),
  [RelativeDate.StartOfLastQuarter]: () =>
    startOfQuarter(addMonths(startOfToday(), -3)),
  [RelativeDate.StartOfThisYear]: () => startOfYear(startOfToday()),
  [RelativeDate.StartOfNextYear]: () =>
    startOfYear(addMonths(startOfToday(), 12)),
  [RelativeDate.StartOfLastYear]: () =>
    startOfYear(addMonths(startOfToday(), -12)),
  [RelativeDate.ThreeDaysAgo]: () => addDays(startOfToday(), -3),
  [RelativeDate.ThirtyDaysAgo]: () => addDays(startOfToday(), -30),
  [RelativeDate.NinetyDaysAgo]: () => addDays(startOfToday(), -90),
  [RelativeDate.SixMonthsAgo]: () => addMonths(startOfToday(), -6),
  [RelativeDate.OneYearAgo]: () => addMonths(startOfToday(), -12),
}

export const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd'

export class RichDate {
  constructor(
    public value: Date | RelativeDate = new Date(),
    public format: string = DEFAULT_DATE_FORMAT,
  ) {}

  static fromString(
    formattedValue: string,
    format: string = DEFAULT_DATE_FORMAT,
  ): RichDate {
    if (Object.values(RelativeDate).includes(formattedValue as RelativeDate)) {
      return new RichDate(formattedValue as RelativeDate, format)
    }

    const date = parseDate(formattedValue, format, new Date())
    const timezoneAgnosticDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    )

    return new RichDate(timezoneAgnosticDate, format)
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
    return RELATIVE_DATE_RESOLVE_FNS[this.value]?.() || new Date()
  }
}

export const RELATIVE_DATES: Record<string, RelativeDate> = {
  Today: RelativeDate.Today,
  Tomorrow: RelativeDate.Tomorrow,
  Yesterday: RelativeDate.Yesterday,
  'One week ago': RelativeDate.OneWeekAgo,
  'One week from now': RelativeDate.OneWeekFromNow,
  'One month ago': RelativeDate.OneMonthAgo,
  'One month from now': RelativeDate.OneMonthFromNow,
}

export type RelativeRange = {
  start: RelativeDate
  end: RelativeDate
}

export const RELATIVE_RANGES: Record<string, RelativeRange> = {
  'Current week': {
    start: RelativeDate.StartOfThisWeek,
    end: RelativeDate.StartOfNextWeek,
  },
  'Current month': {
    start: RelativeDate.StartOfThisMonth,
    end: RelativeDate.StartOfNextMonth,
  },
  'Current quarter': {
    start: RelativeDate.StartOfThisQuarter,
    end: RelativeDate.StartOfNextQuarter,
  },
  'Current year': {
    start: RelativeDate.StartOfThisYear,
    end: RelativeDate.StartOfNextYear,
  },
  'Last week': {
    start: RelativeDate.StartOfLastWeek,
    end: RelativeDate.StartOfThisWeek,
  },
  'Last month': {
    start: RelativeDate.StartOfLastMonth,
    end: RelativeDate.StartOfThisMonth,
  },
  'Last quarter': {
    start: RelativeDate.StartOfLastQuarter,
    end: RelativeDate.StartOfThisQuarter,
  },
  'Last year': {
    start: RelativeDate.StartOfLastYear,
    end: RelativeDate.StartOfThisYear,
  },
  'Last 3 days': {
    start: RelativeDate.ThreeDaysAgo,
    end: RelativeDate.Today,
  },
  'Last 7 days': {
    start: RelativeDate.OneWeekAgo,
    end: RelativeDate.Today,
  },
  'Last 14 days': {
    start: RelativeDate.TwoWeeksAgo,
    end: RelativeDate.Today,
  },
  'Last 30 days': {
    start: RelativeDate.ThirtyDaysAgo,
    end: RelativeDate.Today,
  },
  'Last 60 days': {
    start: RelativeDate.ThirtyDaysAgo,
    end: RelativeDate.Today,
  },
  'Last 90 days': {
    start: RelativeDate.NinetyDaysAgo,
    end: RelativeDate.Today,
  },
  'Last 6 months': {
    start: RelativeDate.SixMonthsAgo,
    end: RelativeDate.Today,
  },
  'Last 12 months': {
    start: RelativeDate.OneYearAgo,
    end: RelativeDate.Today,
  },
}
