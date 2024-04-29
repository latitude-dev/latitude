import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'mt-4 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0',
    className,
  )
}
