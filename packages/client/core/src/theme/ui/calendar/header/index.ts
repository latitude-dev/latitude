import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('relative flex w-full items-center justify-between pt-1', className)
}
