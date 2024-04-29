import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-overflow-hidden lat-p-1 lat-text-foreground [&_[data-cmdk-group-heading]]:lat-px-2 [&_[data-cmdk-group-heading]]:lat-py-1.5 [&_[data-cmdk-group-heading]]:lat-text-xs [&_[data-cmdk-group-heading]]:lat-font-medium [&_[data-cmdk-group-heading]]:lat-text-muted-foreground',
    className,
  )
}
