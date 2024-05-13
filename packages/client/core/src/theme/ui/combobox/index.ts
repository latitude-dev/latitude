import { cn } from '../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('lat-w-full lat-justify-between', className)
}

export const BUTTON_ICON_CSS_CLASS =
  'lat-ml-2 lat-h-4 lat-w-4 lat-shrink-0 lat-opacity-50'
export const SEARCH_BOX_CSS_CLASS = 'lat-h-9'
export const SCROLL_AREA_CSS_CLASS = 'lat-max-h-[300px]'
export const POPOVER_CSS_CLASS = 'lat-min-w-[200px] lat-p-0'
export function checkIconCssClass({ isSelected }: { isSelected: boolean }) {
  return cn('lat-mr-2 lat-h-4 lat-w-4', {
    'lat-text-transparent': !isSelected,
  })
}
