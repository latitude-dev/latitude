import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-max-h-[300px] lat-overflow-y-auto lat-overflow-x-hidden',
    className,
  )
}
