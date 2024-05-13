import { cn } from '../../../utils'
import { zIndexes } from '../../tokens/zIndex'

export function cssClass({
  className,
  isRangeCalendar = false,
}: {
  className?: string | null
  isRangeCalendar?: boolean
}) {
  return cn(
    'lat-relative lat-p-0 lat-text-center lat-text-sm',
    `focus-within:lat-relative focus-within:${zIndexes.focusedCalendarCell}`,
    '[&:has([data-selected])]:lat-bg-accent [&:has([data-selected][data-outside-month])]:lat-bg-accent/50',
    {
      '[&:has([data-selected])]:lat-rounded-md': !isRangeCalendar,
      'first:[&:has([data-selected])]:lat-rounded-l-md last:[&:has([data-selected])]:lat-rounded-r-md':
        isRangeCalendar,
      '[&:has([data-selected][data-selection-end])]:lat-rounded-r-md [&:has([data-selected][data-selection-start])]:lat-rounded-l-md':
        isRangeCalendar,
    },
    className,
  )
}
