import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50', className)
}

export const WRAPPER_CSS_CLASS = "flex items-center border-b px-3"
export const ICON_CSS_CLASS = "mr-2 h-4 w-4 shrink-0 opacity-50"