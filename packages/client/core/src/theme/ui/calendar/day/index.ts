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
    'h-8 w-8 p-0 font-normal',
    // Today
    '[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground',
    {
      'data-[selected]:opacity-100': isRangeCalendar,
      // Selected (single)
      'data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:opacity-100 data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground':
        !isRangeCalendar,
      // Selection Start (range)
      'data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground data-[selection-start]:hover:bg-primary data-[selection-start]:hover:text-primary-foreground data-[selection-start]:focus:bg-primary data-[selection-start]:focus:text-primary-foreground':
        isRangeCalendar,
      // Selection End (range)
      'data-[selection-end]:bg-primary data-[selection-end]:text-primary-foreground data-[selection-end]:hover:bg-primary data-[selection-end]:hover:text-primary-foreground data-[selection-end]:focus:bg-primary data-[selection-end]:focus:text-primary-foreground':
        isRangeCalendar,
    },
    // Disabled
    'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
    // Unavailable
    'data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through',
    // Outside months
    'data-[outside-month]:pointer-events-none data-[outside-month]:text-muted-foreground data-[outside-month]:opacity-50 [&[data-outside-month][data-selected]]:bg-accent/50 [&[data-outside-month][data-selected]]:text-muted-foreground [&[data-outside-month][data-selected]]:opacity-30',
    className,
  )
}
