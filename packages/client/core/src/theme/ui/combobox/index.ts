import { cn } from '../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('w-full justify-between', className)
}

export const BUTTON_ICON_CSS_CLASS = 'ml-2 h-4 w-4 shrink-0 opacity-50'
export const SEARCH_BOX_CSS_CLASS = 'h-9'
export const SCROLL_AREA_CSS_CLASS = 'max-h-[300px]'
export const POPOVER_CSS_CLASS = 'min-w-[200px] p-0'
export function checkIconCssClass({ isSelected }: { isSelected: boolean }) {
  return cn('mr-2 h-4 w-4', {
    'text-transparent': !isSelected,
  })
}
