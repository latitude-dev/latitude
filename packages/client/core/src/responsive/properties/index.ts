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

export type Properties = typeof properties

export const properties = {
  gap,
  flexAlign,
}

export default function compile() {
  return generateClasses({ properties })
}
