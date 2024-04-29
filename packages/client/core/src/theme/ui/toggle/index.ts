import {
  tv,
  type VariantProps as TailwindVariantProps,
} from 'tailwind-variants'
import { cn } from '../../utils'

export enum ToggleVariant {
  Default = 'default',
  Outline = 'outline',
}
export enum ToggleSize {
  Default = 'default',
  Sm = 'sm',
  Lg = 'lg',
}

export const TOGGLE_VARIANTS = Object.values(ToggleVariant)
export const TOGGLE_SIZES = Object.values(ToggleSize)

export type VariantProps = TailwindVariantProps<typeof toggleVariants>
export type Variant = VariantProps['variant']
export type Size = VariantProps['size']

export const toggleVariants = tv({
  base: 'lat-inline-flex lat-items-center lat-justify-center lat-rounded-md lat-text-sm lat-font-medium lat-transition-colors hover:lat-bg-muted hover:lat-text-muted-foreground focus-visible:lat-outline-none focus-visible:lat-ring-1 focus-visible:lat-ring-ring disabled:lat-pointer-events-none disabled:lat-opacity-50 data-[state=on]:lat-bg-accent data-[state=on]:lat-text-accent-foreground',
  variants: {
    variant: {
      default: 'lat-bg-transparent',
      outline:
        'lat-border lat-border-input lat-bg-transparent lat-shadow-sm hover:lat-bg-accent hover:lat-text-accent-foreground',
    },
    size: {
      default: 'lat-h-9 lat-px-3',
      sm: 'lat-h-8 lat-px-2',
      lg: 'lat-h-10 lat-px-3',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

type ClassProps = {
  variant: Variant
  size: Size
  className?: string | null | undefined
}
export function cssClass({ variant, size, className }: ClassProps) {
  return cn(toggleVariants({ variant, size, className }))
}
