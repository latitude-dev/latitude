import { cn } from '../../utils'

export function cssClass({ className }: { className?: string }) {
  return cn(
    'lat-inline-flex lat-min-w-0 lat-items-center lat-justify-center lat-rounded-md lat-text-sm lat-font-medium lat-whitespace-nowrap lat-transition-colors focus-visible:lat-outline-none focus-visible:lat-ring-1 focus-visible:lat-ring-ring disabled:lat-pointer-events-none disabled:lat-opacity-50 lat-shadow-sm lat-bg-accent lat-text-accent-foreground',
    className,
  )
}

export const SELECT_CSS_CLASS = 'lat-w-full lat-overflow-hidden lat-bg-background'
export const SELECT_TEXT_CSS_CLASS = 'lat-w-full lat-text-left lat-font-normal lat-whitespace-nowrap lat-text-ellipsis lat-overflow-hidden'

export const POPOVER_CONTENT_CSS_CLASS =
  'lat-flex lat-w-auto lat-flex-col lat-space-y-2 lat-p-2'

export const TOGGLE_GROUP_CSS_CLASS = 'lat-p-0.5 lat-gap-0.5'
export const TOGGLE_BUTTON_CSS_CLASS =
  'lat-h-8 lat-w-8 lat-p-0 data-[state=on]:lat-bg-background data-[state=on]:lat-text-primary data-[state=on]:lat-shadow-sm data-[state=on]:lat-border data-[state=on]:lat-border-input'
export const TOGGLE_ICON_CSS_CLASS = 'lat-h-4 lat-w-4'
