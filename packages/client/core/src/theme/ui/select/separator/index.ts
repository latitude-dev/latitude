import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn('-mx-1 my-1 h-px bg-muted', className)
}
