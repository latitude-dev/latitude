import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-fixed lat-inset-0 lat-z-50 lat-bg-background/80 lat-backdrop-blur-sm',
    className,
  )
}
