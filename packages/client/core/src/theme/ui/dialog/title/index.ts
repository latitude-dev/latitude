import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('text-lg font-semibold leading-none tracking-tight', className)
}