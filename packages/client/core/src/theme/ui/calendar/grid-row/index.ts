import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('lat-flex', className)
}
