import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '../../utils'

type CardType = VariantProps<typeof cardRootVariants>['type']

const cardRootVariants = tv({
  base: 'lat-rounded-xl lat-bg-card lat-text-card-foreground ',
  variants: {
    type: {
      normal: 'lat-border lat-shadow',
      invisible: '',
    },
  },
})

const cardHeaderVariants = tv({
  base: 'lat-flex lat-flex-col lat-space-y-1.5',
  variants: {
    type: {
      normal: 'lat-pb-6',
      invisible: '',
    },
  },
})

const cardContentVariants = tv({
  base: '',
  variants: {
    type: {
      normal: 'lat-p-6 lat-pt-0',
      invisible: '',
    },
  },
})

type ClassProps = { className?: string | null | undefined }
export type CardProps = ClassProps & { type?: CardType }

export function rootCssClass({ type = 'normal', className }: CardProps) {
  return cn(cardRootVariants({ type }), className)
}

export function headerCssClass({ type = 'normal', className }: CardProps) {
  return cn(cardHeaderVariants({ type }), className)
}

export function titleCssClass({ className }: ClassProps) {
  return cn('lat-font-semibold lat-leading-none lat-tracking-tight', className)
}

export function descriptionCssClass({ className }: ClassProps) {
  return cn('lat-text-sm lat-text-muted-foreground', className)
}

export function contentCssClass({ type = 'normal', className }: CardProps) {
  return cn(cardContentVariants({ type }), className)
}

export function footerCssClass({ className }: ClassProps) {
  return cn('lat-text-sm lat-text-muted-foreground', className)
}
