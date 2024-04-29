import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-relative lat-flex lat-w-full lat-cursor-default lat-select-none lat-items-center lat-rounded-sm lat-py-1.5 lat-pl-2 lat-pr-8 lat-text-sm lat-outline-none data-[disabled]:lat-pointer-events-none data-[highlighted]:lat-bg-accent data-[highlighted]:lat-text-accent-foreground data-[disabled]:lat-opacity-50',
    className,
  )
}

export const ITEM_CSS_CLASS =
  'lat-absolute lat-right-2 lat-flex lat-h-3.5 lat-w-3.5 lat-items-center lat-justify-center'
export const INDICATOR_CHECK_CSS_CLASS = 'lat-h-4 lat-w-4'
