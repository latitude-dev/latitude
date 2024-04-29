import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-flex lat-flex-col-reverse sm:lat-flex-row sm:lat-justify-end sm:lat-space-x-2',
    className,
  )
}
