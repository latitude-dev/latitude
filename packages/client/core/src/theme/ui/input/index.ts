import { cn } from '../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-flex lat-h-9 lat-w-full lat-rounded-md lat-border lat-border-input lat-bg-transparent lat-px-3 lat-py-1 lat-text-sm lat-shadow-sm lat-transition-colors file:lat-border-0 file:lat-bg-transparent file:lat-text-sm file:lat-font-medium placeholder:lat-text-muted-foreground focus-visible:lat-outline-none focus-visible:lat-ring-1 focus-visible:lat-ring-ring disabled:lat-cursor-not-allowed disabled:lat-opacity-50',
    className,
  )
}

export const WRAPPER_CSS_CLASS =
  'lat-flex lat-flex-col lat-w-full lat-gap-1.5 lat-min-w-0'
