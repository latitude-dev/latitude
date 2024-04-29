import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-relative lat-flex lat-w-full lat-items-center lat-justify-between lat-pt-1',
    className,
  )
}
