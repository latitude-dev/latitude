import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className)
}