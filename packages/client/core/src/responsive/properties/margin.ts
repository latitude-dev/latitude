import { Space } from '../space'

const margin: Record<Space, string> = {
  none: 'm-0',
  xxsmall: 'm-1',
  xsmall: 'm-2',
  small: 'm-3',
  medium: 'm-5',
  gutter: 'm-6',
  large: 'm-8',
  xlarge: 'm-12',
  xxlarge: 'm-24',
  xxxlarge: 'm-32',
}

const marginLeft: Record<Space, string> = {
  none: 'ml-0',
  xxsmall: 'ml-1',
  xsmall: 'ml-2',
  small: 'ml-3',
  medium: 'ml-5',
  gutter: 'ml-6',
  large: 'ml-8',
  xlarge: 'ml-12',
  xxlarge: 'ml-24',
  xxxlarge: 'ml-32',
}

const marginRight: Record<Space, string> = {
  none: 'mr-0',
  xxsmall: 'mr-1',
  xsmall: 'mr-2',
  small: 'mr-3',
  medium: 'mr-5',
  gutter: 'mr-6',
  large: 'mr-8',
  xlarge: 'mr-12',
  xxlarge: 'mr-24',
  xxxlarge: 'mr-32',
}

const marginTop: Record<Space, string> = {
  none: 'mt-0',
  xxsmall: 'mt-1',
  xsmall: 'mt-2',
  small: 'mt-3',
  medium: 'mt-5',
  gutter: 'mt-6',
  large: 'mt-8',
  xlarge: 'mt-12',
  xxlarge: 'mt-24',
  xxxlarge: 'mt-32',
}

const marginBottom: Record<Space, string> = {
  none: 'mb-0',
  xxsmall: 'mb-1',
  xsmall: 'mb-2',
  small: 'mb-3',
  medium: 'mb-5',
  gutter: 'mb-6',
  large: 'mb-8',
  xlarge: 'mb-12',
  xxlarge: 'mb-24',
  xxxlarge: 'mb-32',
}

export default { margin, marginLeft, marginRight, marginTop, marginBottom }

