import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('lat-py-6 lat-text-center lat-text-sm', className)
}
