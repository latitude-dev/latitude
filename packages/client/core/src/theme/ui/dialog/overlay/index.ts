import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('fixed inset-0 z-50 bg-background/80 backdrop-blur-sm', className)
}