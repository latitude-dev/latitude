import { cn } from '../../utils'

export function cssClass({
  isLoading,
  className,
}: {
  isLoading: boolean
  className?: string | null
}) {
  return cn(
    'lat-relative lat-h-full lat-w-full',
    { 'animate-pulse': isLoading },
    className,
  )
}

export const CARD_CSS_CLASS = 'lat-h-full'
