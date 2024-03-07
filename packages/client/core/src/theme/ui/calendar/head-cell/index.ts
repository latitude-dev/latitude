import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn("w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground", className)
}