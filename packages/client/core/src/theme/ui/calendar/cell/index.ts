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
    'relative p-0 text-center text-sm',
    `focus-within:relative focus-within:${zIndexes.focusedCalendarCell}`,
    '[&:has([data-selected])]:bg-accent [&:has([data-selected][data-outside-month])]:bg-accent/50',
    {
      '[&:has([data-selected])]:rounded-md': !isRangeCalendar,
      'first:[&:has([data-selected])]:rounded-l-md last:[&:has([data-selected])]:rounded-r-md':
        isRangeCalendar,
      '[&:has([data-selected][data-selection-end])]:rounded-r-md [&:has([data-selected][data-selection-start])]:rounded-l-md':
        isRangeCalendar,
    },
    className,
  )
}
