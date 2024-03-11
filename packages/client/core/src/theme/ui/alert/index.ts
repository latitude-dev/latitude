import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '../../utils'

export type Variant = VariantProps<typeof alertVariants>['variant']
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export type Props = {
  variant: Variant
  scrollable?: boolean
  className?: string | null
}

export const alertVariants = tv({
  base: 'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  variants: {
    variant: {
      default: 'bg-background text-foreground',
      destructive:
        'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

function rootCssClass({
  variant,
  className,
  scrollable = false
}: Props) {
  return cn(
    alertVariants({ variant }),
    'text-sm [&_p]:leading-relaxed',
    className,
    {
      'overflow-y-auto custom-scrollbar': scrollable,
    }
  )
}

export const root = { cssClass: rootCssClass }
