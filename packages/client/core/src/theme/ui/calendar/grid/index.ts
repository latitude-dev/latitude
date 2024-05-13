import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('lat-w-full lat-border-collapse lat-space-y-1', className)
}
