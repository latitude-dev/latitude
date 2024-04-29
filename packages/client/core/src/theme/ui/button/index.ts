import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '../../utils'

export enum ButtonVariant {
  Default = 'default',
  Destructive = 'destructive',
  Outline = 'outline',
  Secondary = 'secondary',
  Ghost = 'ghost',
  Link = 'link',
}
export enum BUTTON_SIZE {
  Default = 'default',
  Sm = 'sm',
  Lg = 'lg',
  Icon = 'icon',
}

export const BUTTON_VARIANTS = Object.values(ButtonVariant)
export const BUTTON_SIZES = Object.values(BUTTON_SIZE)

export type Variant = VariantProps<typeof buttonVariants>['variant']
export type Size = VariantProps<typeof buttonVariants>['size']

export const buttonVariants = tv({
  base: 'lat-inline-flex lat-items-center lat-justify-center lat-rounded-md lat-text-sm lat-font-medium lat-whitespace-nowrap lat-transition-colors focus-visible:lat-outline-none focus-visible:lat-ring-1 focus-visible:lat-ring-ring disabled:lat-pointer-events-none disabled:lat-opacity-50',
  variants: {
    variant: {
      default:
        'lat-bg-primary lat-text-primary-foreground lat-shadow hover:lat-bg-primary/90',
      destructive:
        'lat-bg-destructive lat-text-destructive-foreground lat-shadow-sm hover:lat-bg-destructive/90',
      outline:
        'lat-border lat-border-input lat-bg-background lat-shadow-sm hover:lat-bg-accent hover:lat-text-accent-foreground',
      secondary:
        'lat-bg-secondary lat-text-secondary-foreground lat-shadow-sm hover:lat-bg-secondary/80',
      ghost: 'hover:lat-bg-accent hover:lat-text-accent-foreground',
      link: 'lat-text-primary lat-underline-offset-4 hover:lat-underline',
    },
    size: {
      default: 'lat-h-9 lat-px-4 lat-py-2',
      sm: 'lat-h-8 lat-rounded-md lat-px-3 lat-text-xs',
      lg: 'lat-h-10 lat-rounded-md lat-px-8',
      icon: 'lat-h-9 lat-w-9',
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
  return cn(buttonVariants({ variant, size, className }))
}
