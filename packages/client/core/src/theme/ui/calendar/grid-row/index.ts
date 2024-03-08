import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn("flex", className)
}