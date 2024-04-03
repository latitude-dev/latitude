import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)
}