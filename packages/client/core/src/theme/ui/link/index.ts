import { cn } from '../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-inline-flex lat-items-center lat-justify-center lat-gap-2 lat-font-medium lat-text-primary focus:lat-outline-none focus-visible:lat-ring-2 focus-visible:lat-ring-offset-2 focus-visible:lat-ring-primary lat-transition-colors disabled:lat-cursor-not-allowed disabled:lat-opacity-50',
    className,
  )
}
