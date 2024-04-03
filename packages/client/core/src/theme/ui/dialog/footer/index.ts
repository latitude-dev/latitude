import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)
}