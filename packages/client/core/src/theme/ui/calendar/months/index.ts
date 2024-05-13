import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-mt-4 lat-flex lat-flex-col lat-space-y-4 sm:lat-flex-row sm:lat-space-x-4 sm:lat-space-y-0',
    className,
  )
}
