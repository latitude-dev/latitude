export const breakpoints = {
  mobile: '', // Nothing is added to the class name
  tablet: 'md',
  desktop: 'lg',
  wide: 'xl',
}

export type Breakpoint = keyof typeof breakpoints
export const BP_LIST = Object.keys(breakpoints) as Breakpoint[]


