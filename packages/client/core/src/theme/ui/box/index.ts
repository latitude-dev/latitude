import resolveResponsiveValue, {
  ResponsiveValue,
} from '../../../responsive/resolveResponsiveValue'
import { responsiveProp } from '$src/responsive/utils'
import { cn } from '$src/theme/utils'

export type ResponsiveBox = {
  backgroundColor?:
  | 'transparent'
  | 'default'
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'inherit'
  display?: ResponsiveValue<'display'>
  alignX?: ResponsiveValue<'flexAlign'>
  alignY?: ResponsiveValue<'flexYAlign'>
  flexShrink?: ResponsiveValue<'flexShrink'>
  flexGrow?: ResponsiveValue<'flexGrow'>
  overflow?: ResponsiveValue<'overflow'>
  direction?: ResponsiveValue<'flexDirection'>
  borderRadius?: ResponsiveValue<'borderRadius'>
  gap?: ResponsiveValue<'gap'>
  gapY?: ResponsiveValue<'gapY'>
  gapX?: ResponsiveValue<'gapX'>
  position?: ResponsiveValue<'position'>
  margin?: ResponsiveValue<'margin'>
  marginLeft?: ResponsiveValue<'marginLeft'>
  marginRight?: ResponsiveValue<'marginRight'>
  marginTop?: ResponsiveValue<'marginTop'>
  marginBottom?: ResponsiveValue<'marginBottom'>
  padding?: ResponsiveValue<'padding'>
  paddingLeft?: ResponsiveValue<'paddingLeft'>
  paddingRight?: ResponsiveValue<'paddingRight'>
  paddingTop?: ResponsiveValue<'paddingTop'>
  paddingBottom?: ResponsiveValue<'paddingBottom'>
  className?: string | null | undefined
}

export function cssClasses({
  backgroundColor: bg = 'transparent',
  display = 'flex',
  direction = 'row',
  alignX,
  alignY,
  flexShrink,
  flexGrow,
  position,
  overflow,
  borderRadius,
  gap,
  gapY,
  gapX,
  margin,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  padding,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  className,
}: ResponsiveBox = {}) {
  return cn(
    resolveResponsiveValue({ property: 'display', value: display }),
    resolveResponsiveValue({ property: 'flexAlign', value: alignX }),
    resolveResponsiveValue({ property: 'flexYAlign', value: alignY }),
    resolveResponsiveValue({ property: 'flexDirection', value: direction }),
    resolveResponsiveValue({ property: 'borderRadius', value: borderRadius }),
    resolveResponsiveValue({ property: 'position', value: position }),
    resolveResponsiveValue({ property: 'flexShrink', value: flexShrink }),
    resolveResponsiveValue({ property: 'flexGrow', value: flexGrow }),
    resolveResponsiveValue({ property: 'overflow', value: overflow }),
    resolveResponsiveValue({ property: 'gap', value: gap }),
    resolveResponsiveValue({ property: 'gapY', value: gapY }),
    resolveResponsiveValue({ property: 'gapX', value: gapX }),
    resolveResponsiveValue({ property: 'margin', value: margin }),
    resolveResponsiveValue({ property: 'marginLeft', value: marginLeft }),
    resolveResponsiveValue({ property: 'marginRight', value: marginRight }),
    resolveResponsiveValue({ property: 'marginTop', value: marginTop }),
    resolveResponsiveValue({ property: 'marginBottom', value: marginBottom }),
    resolveResponsiveValue({ property: 'padding', value: padding }),
    resolveResponsiveValue({ property: 'paddingLeft', value: paddingLeft }),
    resolveResponsiveValue({ property: 'paddingRight', value: paddingRight }),
    resolveResponsiveValue({ property: 'paddingTop', value: paddingTop }),
    resolveResponsiveValue({ property: 'paddingBottom', value: paddingBottom }),
    className,
    {
      [responsiveProp({ prop: 'bg-transparent' })]: bg === 'transparent',
      [responsiveProp({ prop: 'bg-background' })]: bg === 'default',
      [responsiveProp({ prop: 'bg-primary' })]: bg === 'primary',
      [responsiveProp({ prop: 'bg-secondary' })]: bg === 'secondary',
      [responsiveProp({ prop: 'bg-muted' })]: bg === 'muted',
      [responsiveProp({ prop: 'bg-inherit' })]: bg === 'inherit',
    },
  )
}
