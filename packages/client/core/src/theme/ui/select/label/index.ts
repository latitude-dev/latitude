import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('px-2 py-1.5 text-sm font-semibold', className)
}
