export const breakpoints = {
  mobile: '', // Nothing is added to the class name
  tablet: 'md',
  desktop: 'lg',
  wide: 'xl',
  extraWide: '2xl',
}

export type Breakpoint = keyof typeof breakpoints
