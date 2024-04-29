import { cn } from '../../../utils'
import { zIndexes } from '../../tokens/zIndex'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    zIndexes.selectContent,
    'relative min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md focus:outline-none',
    className,
  )
}

export const CONTAINER_CSS_CLASS = 'w-full p-1'
