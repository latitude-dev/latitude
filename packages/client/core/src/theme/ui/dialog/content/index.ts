import { cn } from '../../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-fixed lat-left-1/2 lat-top-1/2 lat-z-50 lat-grid lat-w-full lat-max-w-lg lat-translate-x-[-50%] lat-translate-y-[-50%] lat-gap-4 lat-border lat-bg-background lat-p-6 lat-shadow-lg sm:lat-rounded-lg md:lat-w-full',
    className,
  )
}

export const CLOSE_BUTTON_CSS_CLASS =
  'lat-absolute lat-right-4 lat-top-4 lat-rounded-sm lat-opacity-70 lat-ring-offset-background lat-transition-opacity hover:lat-opacity-100 focus:lat-outline-none focus:lat-ring-2 focus:lat-ring-ring focus:lat-ring-offset-2 disabled:lat-pointer-events-none data-[state=open]:lat-bg-accent data-[state=open]:lat-text-muted-foreground'
export const CLOSE_ICON_CSS_CLASS = 'lat-h-4 lat-w-4'
export const CLOSE_LABEL_CSS_CLASS = 'lat-sr-only'
