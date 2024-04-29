import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('lat-px-2 lat-py-1.5 lat-text-sm lat-font-semibold', className)
}
