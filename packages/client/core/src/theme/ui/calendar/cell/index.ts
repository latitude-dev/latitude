import { cn } from '../../../utils'
import { zIndexes } from '../../tokens/zIndex'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'relative p-0 text-center text-sm',
    `focus-within:relative focus-within:${zIndexes.focusedCalendarCell}`,
    '[&:has([data-selected])]:rounded-md [&:has([data-selected])]:bg-accent [&:has([data-selected][data-outside-month])]:bg-accent/50',
    className,
  )
}
