import { ResponsiveSpace } from "$src/responsive/responsiveSpace"

export type BetaRow = {
  space?: ResponsiveSpace
}
export function betaRow({ space }: BetaRow = { space: 'none'}) {
  // responsive negative margin left
  // responsive child paddingLeft right
  // responsive gapY

  // return { childProps: { paddingLeft: ResponsiveSpace<'paddingLeft'> }, className: string }
  return ''
}
