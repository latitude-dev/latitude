import { tv, type VariantProps } from 'tailwind-variants'
import { cssClasses as box } from '$src/theme/ui/box'
import { cn } from '../../utils'

export type Width = Exclude<
  VariantProps<typeof widthVariants>['width'],
  undefined
>
export const widthVariants = tv({
  base: 'lat-flex lat-flex-col',
  variants: {
    width: {
      '1/12': 'w-1/12',
      '2/12': 'w-2/12',
      '3/12': 'w-3/12',
      '4/12': 'w-4/12',
      '5/12': 'w-5/12',
      '6/12': 'w-6/12',
      '7/12': 'w-7/12',
      '8/12': 'w-8/12',
      '9/12': 'w-9/12',
      '10/12': 'w-10/12',
      '11/12': 'w-11/12',
    },
  },
})
export type ColumnProps = {
  width?: Width | 'content'
  className?: string | null | undefined
}

export function cssClass({ width: inputWidth, className }: ColumnProps) {
  const widthVariant =
    inputWidth && inputWidth !== 'content'
      ? widthVariants({ width: inputWidth })
      : ''
  return box({
    flexShrink: inputWidth === 'content' ? 0 : undefined,
    flexGrow: 1,
    className: cn(className, {
      [widthVariant]: !!widthVariant,
      'w-full': inputWidth === 'content',
    }),
  })
}
