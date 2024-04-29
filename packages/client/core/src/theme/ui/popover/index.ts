import { cn } from '../../utils'
import { zIndexes } from '../tokens/zIndex'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    zIndexes.popover,
    'lat-w-72 lat-rounded-md lat-border lat-bg-popover lat-p-4 lat-text-popover-foreground lat-shadow-md lat-outline-none',
    className,
  )
}
