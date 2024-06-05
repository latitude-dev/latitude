import { Space } from '../space'
import generateClasses from './classGenerator'

const gap: Record<Space, string> = {
  none: 'gap-0',
  xxsmall: 'gap-1',
  xsmall: 'gap-2',
  small: 'gap-3',
  medium: 'gap-5',
  gutter: 'gap-6',
  large: 'gap-8',
  xlarge: 'gap-12',
  xxlarge: 'gap-24',
  xxxlarge: 'gap-32',
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

export const properties = {
  gap,
  flexAlign,
  flexYAlign,
}

export type Properties = typeof properties
export type Property = keyof Properties
export type PropertyValue<T extends Property> = keyof Properties[T]

export default function compile() {
  return generateClasses({ properties })
}
