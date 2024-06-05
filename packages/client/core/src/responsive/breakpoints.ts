export const breakpoints = {
  mobile: '', // Nothing is added to the class name
  tablet: 'md',
  desktop: 'lg',
  wide: 'xl',
  extraWide: '2xl',
}

export type Breakpoint = keyof typeof breakpoints
export type BreakpointObject<T> = { [key in Breakpoint]: T }
export const BP_LIST = Object.keys(breakpoints) as Breakpoint[]
