import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '../../utils'

type CardType = VariantProps<typeof cardRootVariants>['type']
const NORMAL_PADDING = 'p-6'

const cardRootVariants = tv({
  base: 'rounded-xl bg-card text-card-foreground ',
  variants: {
    type: {
      normal: 'border shadow',
      invisible: ''
    },
  }
})

const cardHeaderVariants = tv({
  base: 'flex flex-col space-y-1.5',
  variants: {
    type: {
      normal: NORMAL_PADDING,
      invisible: 'pb-6'
    }
  }
})

const cardContentVariants = tv({
  base: '',
  variants: {
    type: {
      normal: 'p-6 pt-0',
      invisible: ''
    }
  }
})

type ClassProps = { className?: string | null | undefined }
export type CardProps = ClassProps & { type?: CardType }

export function rootCssClass({ type = 'normal', className }: CardProps) {
  return cn(cardRootVariants({ type }), className)
}

export function headerCssClass({ type = 'normal', className }: CardProps) {
  return cn(cardHeaderVariants({ type }) , className)
}

export function titleCssClass({ className }: ClassProps) {
  return cn('font-semibold leading-none tracking-tight', className)
}

export function descriptionCssClass({ className }: ClassProps) {
  return cn('text-sm text-muted-foreground', className)
}

export function contentCssClass({ type = 'normal', className }: CardProps) {
  return cn(cardContentVariants({ type }), className)
}

export function footerCssClass({ className }: ClassProps) {
  return cn('text-sm text-muted-foreground', className)
}
