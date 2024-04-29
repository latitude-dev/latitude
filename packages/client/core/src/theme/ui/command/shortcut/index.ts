import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-ml-auto lat-text-xs lat-tracking-widest lat-text-muted-foreground',
    className,
  )
}
