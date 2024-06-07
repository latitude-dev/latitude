import {
  Belowbreakpoint,
  resolveResponsiveRangeProps,
} from '$src/responsive/resolveResponsiveRangeProps'
import resolveResponsiveValue from '$src/responsive/resolveResponsiveValue'
import { ResponsiveSpace } from '$src/responsive/responsiveSpace'

export type BetaRow = {
  space: ResponsiveSpace
  collapseBelow?: Belowbreakpoint
}

/**
 * TODO:: Padding Top > 0 for collapsed items
 */
export function betaRow({ space, collapseBelow }: BetaRow = { space: 'none' }) {
  const [collapseMobile, collapseTablet, collapseDesktop] =
    resolveResponsiveRangeProps({
      below: collapseBelow,
    })

  console.log("collapseMobile", collapseMobile)
  console.log("collapseTablet", collapseTablet)
  console.log("collapseDesktop", collapseDesktop)

  const marginLeft = resolveResponsiveValue({
    property: 'marginLeft',
    value: space,
    generateNegative: true,
  })
  const childSpaceClasses = resolveResponsiveValue({
    property: 'paddingLeft',
    value: space,
  })
  return {
    marginLeftClasses: marginLeft,
    childSpaceClasses: childSpaceClasses,
  }
}
