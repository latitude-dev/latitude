import { cn } from '../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    className,
  )
}
