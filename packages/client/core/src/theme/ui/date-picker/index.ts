import { cn } from '../../utils'

export function cssClass({ className }: { className?: string }) {
  return cn(
    'lat-inline-flex lat-items-center lat-justify-center lat-rounded-md lat-text-sm lat-font-medium lat-whitespace-nowrap lat-transition-colors focus-visible:lat-outline-none focus-visible:lat-ring-1 focus-visible:lat-ring-ring disabled:lat-pointer-events-none disabled:lat-opacity-50 lat-shadow-sm lat-bg-accent lat-text-accent-foreground',
    className,
  )
}

export function selectCssClass({ isRange = false }: { isRange?: boolean }) {
  return cn(
    {
      'lat-w-[240px]': !isRange,
      'lat-w-[340px]': isRange,
    },
    'lat-text-left lat-font-normal lat-bg-white',
  )
}

export function buttonCssClass({ isRange = false }: { isRange?: boolean }) {
  return cn(
    {
      'lat-w-[240px]': !isRange,
      'lat-w-[340px]': isRange,
    },
    'lat-justify-start lat-text-left lat-font-normal lat-overflow-hidden lat-whitespace-nowrap lat-text-overflow-ellipsis',
  )
}
export const POPOVER_CONTENT_CSS_CLASS =
  'lat-flex lat-w-auto lat-flex-col lat-space-y-2 lat-p-2'
export const POPOVER_INNER_CSS_CLASS = 'lat-w-[250px]'

export const TOGGLE_GROUP_CSS_CLASS = 'lat-p-0.5 lat-gap-0.5'
export const TOGGLE_BUTTON_CSS_CLASS =
  'lat-h-8 lat-w-8 lat-p-0 data-[state=on]:lat-bg-background data-[state=on]:lat-text-primary data-[state=on]:lat-shadow-sm data-[state=on]:lat-border data-[state=on]:lat-border-input'
export const TOGGLE_ICON_CSS_CLASS = 'lat-h-4 lat-w-4'
