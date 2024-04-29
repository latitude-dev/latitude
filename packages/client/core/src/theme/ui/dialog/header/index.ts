import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-flex lat-flex-col lat-space-y-1.5 lat-text-center sm:lat-text-left',
    className,
  )
}
