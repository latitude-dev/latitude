import { cn } from '../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'peer-disabled:lat-cursor-not-allowed peer-disabled:lat-opacity-70',
    className,
  )
}
