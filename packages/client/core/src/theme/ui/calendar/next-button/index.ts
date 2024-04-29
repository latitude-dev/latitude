import { cn } from '../../../utils'
import { buttonVariants } from '../../button'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    buttonVariants({ variant: 'outline' }),
    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
    className,
  )
}

export const ICON_CSS_CLASS = 'h-4 w-4'
