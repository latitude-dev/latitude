import { cn } from '../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'inline-flex items-center justify-center gap-2 font-medium text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    className,
  )
}
