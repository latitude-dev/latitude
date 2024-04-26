import { cn } from '../../../utils'
import { zIndexes } from '../../tokens/zIndex'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    zIndexes.selectContent,
    'lat-relative lat-min-w-[8rem] lat-overflow-hidden lat-rounded-md lat-border lat-bg-popover lat-text-popover-foreground lat-shadow-md focus:lat-outline-none',
    className,
  )
}

export const CONTAINER_CSS_CLASS = 'lat-w-full lat-p-1'
