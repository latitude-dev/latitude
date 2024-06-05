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

const paddingRight: Record<Space, string> = {
  none: 'pr-0',
  xxsmall: 'pr-1',
  xsmall: 'pr-2',
  small: 'pr-3',
  medium: 'pr-5',
  gutter: 'pr-6',
  large: 'pr-8',
  xlarge: 'pr-12',
  xxlarge: 'pr-24',
  xxxlarge: 'pr-32',
}

const paddingTop: Record<Space, string> = {
  none: 'pt-0',
  xxsmall: 'pt-1',
  xsmall: 'pt-2',
  small: 'pt-3',
  medium: 'pt-5',
  gutter: 'pt-6',
  large: 'pt-8',
  xlarge: 'pt-12',
  xxlarge: 'pt-24',
  xxxlarge: 'pt-32',
}

const paddingBottom: Record<Space, string> = {
  none: 'pb-0',
  xxsmall: 'pb-1',
  xsmall: 'pb-2',
  small: 'pb-3',
  medium: 'pb-5',
  gutter: 'pb-6',
  large: 'pb-8',
  xlarge: 'pb-12',
  xxlarge: 'pb-24',
  xxxlarge: 'pb-32',
}

export default { padding, paddingLeft, paddingRight, paddingTop, paddingBottom }
