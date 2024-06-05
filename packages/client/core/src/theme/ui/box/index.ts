import resolveResponsiveValue, {
  ResponsiveValue,
} from '$src/responsive/resolveResponsiveValue'
import { responsiveProp } from '$src/responsive/utils'
import { cn } from '$src/theme/utils'

export default function responsiveBoxClasses({
  backgroundColor: bg = 'transparent',
  display = 'flex',
  direction = 'row',
  alignX,
  alignY,
  position,
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
}: {
  backgroundColor?:
  | 'transparent'
  | 'default'
  | 'primary'
  | 'secondary'
  | 'muted'
  display?: ResponsiveValue<'display'>
  alignX?: ResponsiveValue<'flexAlign'>
  alignY?: ResponsiveValue<'flexYAlign'>
  direction?: ResponsiveValue<'flexDirection'>
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
} = {}) {
  return cn(
    resolveResponsiveValue({ property: 'display', value: display }),
    resolveResponsiveValue({ property: 'flexAlign', value: alignX }),
    resolveResponsiveValue({ property: 'flexYAlign', value: alignY }),
    resolveResponsiveValue({ property: 'flexDirection', value: direction }),
    resolveResponsiveValue({ property: 'position', value: position }),
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
    {
      [responsiveProp({ prop: 'bg-transparent'})]: bg === 'transparent',
      [responsiveProp({ prop: 'bg-background'})]: bg === 'default',
      [responsiveProp({ prop: 'bg-primary'})]: bg === 'primary',
      [responsiveProp({ prop: 'bg-secondary'})]: bg === 'secondary',
      [responsiveProp({ prop: 'bg-muted'})]: bg === 'muted',
    },
  )
}
