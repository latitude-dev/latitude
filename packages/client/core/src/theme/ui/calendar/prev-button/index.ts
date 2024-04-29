import { cn } from '../../../utils'
import { buttonVariants } from '../../button'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    buttonVariants({ variant: 'outline' }),
    'lat-h-7 lat-w-7 lat-bg-transparent lat-p-0 lat-opacity-50 hover:lat-opacity-100',
    className,
  )
}

export const ICON_CSS_CLASS = 'lat-h-4 lat-w-4'
