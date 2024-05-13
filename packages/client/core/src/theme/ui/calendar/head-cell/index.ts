import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-w-8 lat-rounded-md lat-text-[0.8rem] lat-font-normal lat-text-muted-foreground',
    className,
  )
}
