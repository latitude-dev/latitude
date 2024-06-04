import { Space } from '../space'

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

const properties = {
  gap,
}
export default function compile() {
  return JSON.stringify(properties)
}
