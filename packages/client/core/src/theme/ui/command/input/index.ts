import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-flex lat-h-10 lat-w-full lat-rounded-md lat-bg-transparent lat-py-3 lat-text-sm lat-outline-none placeholder:lat-text-muted-foreground disabled:lat-cursor-not-allowed disabled:lat-opacity-50',
    className,
  )
}

export const WRAPPER_CSS_CLASS =
  'lat-flex lat-items-center lat-border-b lat-px-3'
export const ICON_CSS_CLASS =
  'lat-mr-2 lat-h-4 lat-w-4 lat-shrink-0 lat-opacity-50'
