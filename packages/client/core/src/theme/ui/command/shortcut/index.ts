import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('ml-auto text-xs tracking-widest text-muted-foreground', className)
}
