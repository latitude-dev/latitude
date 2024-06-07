import { Space } from '../space'

const padding: Record<Space, string> = {
  none: 'p-0',
  xxsmall: 'p-1',
  xsmall: 'p-2',
  small: 'p-3',
  medium: 'p-5',
  gutter: 'p-6',
  large: 'p-8',
  xlarge: 'p-12',
  xxlarge: 'p-24',
  xxxlarge: 'p-32',
}

const paddingLeft: Record<Space, string> = {
  none: 'pl-0',
  xxsmall: 'pl-1',
  xsmall: 'pl-2',
  small: 'pl-3',
  medium: 'pl-5',
  gutter: 'pl-6',
  large: 'pl-8',
  xlarge: 'pl-12',
  xxlarge: 'pl-24',
  xxxlarge: 'pl-32',
}

export default { padding, paddingLeft }
