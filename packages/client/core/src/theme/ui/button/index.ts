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
  base: 'inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
      destructive:
        'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
      outline:
        'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
      secondary:
        'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
      icon: 'h-9 w-9',
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
