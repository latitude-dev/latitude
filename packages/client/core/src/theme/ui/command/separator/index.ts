import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('-lat-mx-1 lat-h-px lat-bg-border', className)
}
