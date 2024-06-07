import resolveResponsiveValue, {
  ResponsiveValue,
} from '../../../responsive/resolveResponsiveValue'
import { latCssPrefix } from '$src/responsive/utils'
import { cn } from '$src/theme/utils'

export type ResponsiveBox = {
  backgroundColor?:
  | 'transparent'
  | 'default'
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'inherit'
  overflow?: ResponsiveValue<'overflow'>
  display?: ResponsiveValue<'display'>
  gapY?: ResponsiveValue<'gapY'>
  alignX?: ResponsiveValue<'flexAlign'>
  alignY?: ResponsiveValue<'flexYAlign'>
  position?: ResponsiveValue<'position'>
  flexShrink?: ResponsiveValue<'flexShrink'>
  flexGrow?: ResponsiveValue<'flexGrow'>
  direction?: ResponsiveValue<'flexDirection'>
  marginLeft?: ResponsiveValue<'marginLeft'>
  padding?: ResponsiveValue<'padding'>
  paddingLeft?: ResponsiveValue<'paddingLeft'>
  borderRadius?: ResponsiveValue<'borderRadius'>
  className?: string | null | undefined
}

export function cssClasses({
  backgroundColor: bg = 'transparent',
  display = 'flex',
  direction = 'row',
  overflow,
  position,
  gapY,
  alignX,
  alignY,
  flexShrink,
  flexGrow,
  marginLeft,
  padding,
  paddingLeft,
  borderRadius,
  className,
}: ResponsiveBox = {}) {
  return cn(
    resolveResponsiveValue({ property: 'overflow', value: overflow }),
    resolveResponsiveValue({ property: 'display', value: display }),
    resolveResponsiveValue({ property: 'flexAlign', value: alignX }),
    resolveResponsiveValue({ property: 'position', value: position }),
    resolveResponsiveValue({ property: 'flexYAlign', value: alignY }),
    resolveResponsiveValue({ property: 'flexDirection', value: direction }),
    resolveResponsiveValue({ property: 'flexShrink', value: flexShrink }),
    resolveResponsiveValue({ property: 'flexGrow', value: flexGrow }),
    resolveResponsiveValue({ property: 'gapY', value: gapY }),
    resolveResponsiveValue({ property: 'marginLeft', value: marginLeft }),
    resolveResponsiveValue({ property: 'padding', value: padding }),
    resolveResponsiveValue({ property: 'paddingLeft', value: paddingLeft }),
    resolveResponsiveValue({ property: 'borderRadius', value: borderRadius }),
    className,
    {
      [latCssPrefix('bg-transparent')]: bg === 'transparent',
      [latCssPrefix('bg-background')]: bg === 'default',
      [latCssPrefix('bg-primary')]: bg === 'primary',
      [latCssPrefix('bg-secondary')]: bg === 'secondary',
      [latCssPrefix('bg-muted')]: bg === 'muted',
      [latCssPrefix('bg-inherit')]: bg === 'inherit',
    },
  )
}
