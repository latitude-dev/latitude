import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('w-full border-collapse space-y-1', className)
}
