import { cn } from '../../utils'
import { zIndexes } from '../tokens/zIndex'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    zIndexes.popover,
    'w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
    className,
  )
}
