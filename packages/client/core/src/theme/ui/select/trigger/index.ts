import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-flex lat-h-9 lat-w-full lat-items-center lat-justify-between lat-whitespace-nowrap lat-rounded-md lat-border lat-border-input lat-bg-transparent lat-px-3 lat-py-2 lat-text-sm lat-shadow-sm lat-ring-offset-background placeholder:lat-text-muted-foreground focus:lat-outline-none focus:lat-ring-1 focus:lat-ring-ring disabled:lat-cursor-not-allowed disabled:lat-opacity-50 [&>span]:lat-line-clamp-1',
    className,
  )
}

export const ICON_CSS_CLASS = 'lat-h-4 lat-w-4 lat-opacity-50'
