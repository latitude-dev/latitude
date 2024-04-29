import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-relative lat-flex lat-cursor-default lat-select-none lat-items-center lat-rounded-sm lat-px-2 lat-py-1.5 lat-text-sm lat-outline-none aria-selected:lat-bg-accent aria-selected:lat-text-accent-foreground data-[disabled]:lat-pointer-events-none data-[disabled]:lat-opacity-50',
    className,
  )
}
