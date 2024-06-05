import generateClasses from './classGenerator'
import padding from './padding'
import margin from './margin'
import gap from './gap'

const display = {
  none: 'hidden',
  block: 'block',
  inline: 'inline',
  inlineBlock: 'inline-block',
  flex: 'flex',
}

const position = {
  static: 'static',
  relative: 'relative',
  absolute: 'absolute',
  fixed: 'fixed',
  sticky: 'sticky',
}

const borderRadius = {
  none: 'rounded-none',
  full: 'rounded-full',
  small: 'rounded-sm',
  medium: 'rounded-md',
  large: 'rounded-lg',
}
const flexAlign = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

const flexYAlign = {
  top: 'items-start',
  center: 'items-center',
  bottom: 'items-end',
}

const flexDirection = {
  row: 'flex-row',
  rowReverse: 'flex-row-reverse',
  column: 'flex-col',
  columnReverse: 'flex-col-reverse',
}

const flexWrap = { wrap: 'flex-wrap', nowrap: 'flex-nowrap' }
const flexShrink = { 0: 'shrink-0', 1: 'shrink' }
const flexGrow = { 0: 'grow-0', 1: 'grow' }
const textAlign = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export const properties = {
  display,
  position,
  borderRadius,
  flexAlign,
  flexYAlign,
  flexDirection,
  flexWrap,
  flexShrink,
  flexGrow,
  textAlign,
  ...gap,
  ...padding,
  ...margin,
}

export type Properties = typeof properties
export type Property = keyof Properties
export type PropertyValue<T extends Property> = keyof Properties[T]

export default function compile() {
  return generateClasses({ properties })
}
