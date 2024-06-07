import { tv, type VariantProps } from 'tailwind-variants'
import { cssClasses as box } from '$src/theme/ui/box'
import { cn } from '../../utils'
import { ResponsiveValue } from '$src/responsive/resolveResponsiveValue'

export type Width = Exclude<
  VariantProps<typeof widthVariants>['width'],
  undefined
>
export const widthVariants = tv({
  variants: {
    width: {
      '1/12': 'lat-flex-[0_0_8.333333%]',
      '2/12': 'lat-flex-[0_0_16.666667%]',
      '3/12': 'lat-flex-[0_0_25%]',
      '4/12': 'lat-flex-[0_0_33.333333%]',
      '5/12': 'lat-flex-[0_0_41.666667%]',
      '6/12': 'lat-flex-[0_0_50%]',
      '7/12': 'lat-flex-[0_0_58.333333%]',
      '8/12': 'lat-flex-[0_0_66.666667%]',
      '9/12': 'lat-flex-[0_0_75%]',
      '10/12': 'lat-flex-[0_0_83.333333%]',
      '11/12': 'lat-flex-[0_0_91.666667%]',
    },
  },
})
export type ColumnProps = {
  width?: Width | 'content'
  paddingLeft: ResponsiveValue<'paddingLeft'>
  className?: string | null | undefined
}

export function cssClass({ width: inputWidth, className }: ColumnProps) {

  // Padding left. How not to apply when is on a breakpoint
  // that should be on a second row?








  const columnWidth =
    inputWidth && inputWidth !== 'content'
      ? widthVariants({ width: inputWidth })
      : undefined
  return box({
    flexShrink: inputWidth === 'content' ? '0' : undefined,
    flexGrow: '1',
    className: cn(className, columnWidth, {
      'lat-min-w-0': !columnWidth,
      'lat-w-full': inputWidth !== 'content',
    }),
  })
}
