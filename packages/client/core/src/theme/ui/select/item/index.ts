import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50',
    className,
  )
}

export const ITEM_CSS_CLASS =
  'absolute right-2 flex h-3.5 w-3.5 items-center justify-center'
export const INDICATOR_CHECK_CSS_CLASS = 'h-4 w-4'
