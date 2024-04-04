import { cn } from '../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50', className)
}

export const WRAPPER_CSS_CLASS = "grid w-full items-center gap-1.5"