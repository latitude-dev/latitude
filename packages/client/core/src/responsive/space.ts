export const spaces = {
  none: 'none',
  xxsmall: 'xxsmall',
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  gutter: 'gutter',
  large: 'large',
  xlarge: 'xlarge',
  xxlarge: 'xxlarge',
  xxxlarge: 'xxxlarge',
}

/**
 * Space size keys with corresponding pixel sizes.
 *
 * - `none` - 0px
 * - `xxsmall` - 1px
 * - `xsmall` - 8px
 * - `small` - 12px
 * - `medium` - 20px
 * - `gutter` - 24px
 * - `large` - 32px
 * - `xlarge` - 48px
 * - `xxlarge` - 96px
 * - `xxxlarge` - 128px
 */
export type Space = keyof typeof spaces
