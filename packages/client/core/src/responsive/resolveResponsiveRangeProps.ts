import { BP_LIST, Breakpoint } from '$src/responsive/breakpoints'

export type Belowbreakpoint = Exclude<Breakpoint, 'mobile'> | undefined
export const resolveResponsiveRangeProps = (
  { below }: { below: Belowbreakpoint}
): [boolean, boolean, boolean, boolean] => {

  if (!below) {
    return [false, false, false, false]
  }

  const endIndex = BP_LIST.indexOf(below)
  const range = BP_LIST.slice(0, endIndex + 1)

  const includeMobile = range.indexOf('mobile') >= 0
  const includeTablet = range.indexOf('tablet') >= 0
  const includeDesktop = range.indexOf('desktop') >= 0
  const includeWide = range.indexOf('wide') >= 0

  return [includeMobile, includeTablet, includeDesktop, includeWide]
}
