import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-text-lg lat-font-semibold lat-leading-none lat-tracking-tight',
    className,
  )
}
