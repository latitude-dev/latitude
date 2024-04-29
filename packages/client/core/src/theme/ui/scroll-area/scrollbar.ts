import { cn } from '../../utils'

export function cssClass({
  className,
  orientation,
}: {
  className?: string | null
  orientation: 'horizontal' | 'vertical'
}) {
  return cn(
    'lat-flex touch-none lat-select-none lat-transition-colors',
    orientation === 'vertical' &&
      'lat-h-full lat-w-2.5 lat-border-l lat-border-l-transparent lat-p-px',
    orientation === 'horizontal' &&
      'lat-h-2.5 lat-w-full lat-border-t lat-border-t-transparent lat-p-px',
    className,
  )
}

export function thumbCssClass({
  orientation,
}: {
  orientation: 'horizontal' | 'vertical'
}) {
  return cn(
    'lat-relative lat-rounded-full lat-bg-border',
    orientation === 'vertical' && 'lat-flex-1',
  )
}
