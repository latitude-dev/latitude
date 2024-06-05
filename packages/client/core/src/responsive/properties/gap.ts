import { Space } from "$src/responsive/space";

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

const gapX: Record<Space, string> = {
  none: 'gap-x-0',
  xxsmall: 'gap-x-1',
  xsmall: 'gap-x-2',
  small: 'gap-x-3',
  medium: 'gap-x-5',
  gutter: 'gap-x-6',
  large: 'gap-x-8',
  xlarge: 'gap-x-12',
  xxlarge: 'gap-x-24',
  xxxlarge: 'gap-x-32',
}

const gapY: Record<Space, string> = {
  none: 'gap-y-0',
  xxsmall: 'gap-y-1',
  xsmall: 'gap-y-2',
  small: 'gap-y-3',
  medium: 'gap-y-5',
  gutter: 'gap-y-6',
  large: 'gap-y-8',
  xlarge: 'gap-y-12',
  xxlarge: 'gap-y-24',
  xxxlarge: 'gap-y-32',
}

export default { gap, gapX, gapY }
