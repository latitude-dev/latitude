import { cn } from '../../../utils'
import { buttonVariants } from '../../button'

export function cssClass({
  className,
  isRangeCalendar = false,
}: {
  className?: string | null
  isRangeCalendar?: boolean
}) {
  return cn(
    buttonVariants({ variant: 'ghost' }),
    'lat-h-8 lat-w-8 lat-p-0 lat-font-normal',
    // Today
    '[&[data-today]:not([data-selected])]:lat-bg-accent [&[data-today]:not([data-selected])]:lat-text-accent-foreground',
    {
      'data-[selected]:lat-opacity-100': isRangeCalendar,
      // Selected (single)
      'data-[selected]:lat-bg-primary data-[selected]:lat-text-primary-foreground data-[selected]:lat-opacity-100 data-[selected]:hover:lat-bg-primary data-[selected]:hover:lat-text-primary-foreground data-[selected]:focus:lat-bg-primary data-[selected]:focus:lat-text-primary-foreground':
        !isRangeCalendar,
      // Selection Start (range)
      'data-[selection-start]:lat-bg-primary data-[selection-start]:lat-text-primary-foreground data-[selection-start]:hover:lat-bg-primary data-[selection-start]:hover:lat-text-primary-foreground data-[selection-start]:focus:lat-bg-primary data-[selection-start]:focus:lat-text-primary-foreground':
        isRangeCalendar,
      // Selection End (range)
      'data-[selection-end]:lat-bg-primary data-[selection-end]:lat-text-primary-foreground data-[selection-end]:hover:lat-bg-primary data-[selection-end]:hover:lat-text-primary-foreground data-[selection-end]:focus:lat-bg-primary data-[selection-end]:focus:lat-text-primary-foreground':
        isRangeCalendar,
    },
    // Disabled
    'data-[disabled]:lat-text-muted-foreground data-[disabled]:lat-opacity-50',
    // Unavailable
    'data-[unavailable]:lat-text-destructive-foreground data-[unavailable]:lat-line-through',
    // Outside months
    'data-[outside-month]:lat-pointer-events-none data-[outside-month]:lat-text-muted-foreground data-[outside-month]:lat-opacity-50 [&[data-outside-month][data-selected]]:lat-bg-accent/50 [&[data-outside-month][data-selected]]:lat-text-muted-foreground [&[data-outside-month][data-selected]]:lat-opacity-30',
    className,
  )
}
