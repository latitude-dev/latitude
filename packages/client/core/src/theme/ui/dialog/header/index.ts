import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('flex flex-col space-y-1.5 text-center sm:text-left', className)
}