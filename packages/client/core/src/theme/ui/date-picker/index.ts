import { cn } from "../../utils"

export function cssClass({ className }: { className?: string }) {
  return cn("inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm bg-accent text-accent-foreground", className)
}

export function selectCssClass({ isRange = false }: { isRange?: boolean }) {
  return cn({
    'w-[240px]': !isRange,
    'w-[340px]': isRange
  }, 'text-left font-normal bg-white')
}

export function buttonCssClass({ isRange = false }: { isRange?: boolean }) {
  return cn({
    'w-[240px]': !isRange,
    'w-[340px]': isRange
  }, 'justify-start text-left font-normal overflow-hidden whitespace-nowrap text-overflow-ellipsis')
}
export const POPOVER_CONTENT_CSS_CLASS = "flex w-auto flex-col space-y-2 p-2"
export const POPOVER_INNER_CSS_CLASS = "w-[250px]"

export const TOGGLE_GROUP_CSS_CLASS = "p-0.5 gap-0.5"
export const TOGGLE_BUTTON_CSS_CLASS = "h-8 w-8 p-0 data-[state=on]:bg-background data-[state=on]:text-primary data-[state=on]:shadow-sm data-[state=on]:border data-[state=on]:border-input"
export const TOGGLE_ICON_CSS_CLASS = "h-4 w-4"