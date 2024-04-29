import { cn } from '../../utils'
import { Size, Variant, VariantProps, toggleVariants } from '../toggle'

export function cssClass({ className }: { className?: string | null }) {
  return cn('lat-flex lat-items-center lat-justify-center lat-gap-1', className)
}

type ClassProps = {
  ctx: VariantProps
  variant: Variant
  size: Size
  className?: string | null | undefined
}
export function itemCssClass({ ctx, variant, size, className }: ClassProps) {
  return cn(
    toggleVariants({
      variant: ctx.variant || variant,
      size: ctx.size || size,
    }),
    className,
  )
}
