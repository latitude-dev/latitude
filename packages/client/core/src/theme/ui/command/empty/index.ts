import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('py-6 text-center text-sm', className)
}
