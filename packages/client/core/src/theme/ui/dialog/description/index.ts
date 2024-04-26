import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('lat-text-sm lat-text-muted-foreground', className)
}
