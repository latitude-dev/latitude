import { Theme } from './types'

const LATITUDE_PREFIX = 'lat'

export function buildCssVariables(theme: Theme) {
  const light = theme.colors.light
  const dark = theme.colors.dark
  const breakpoints = theme.breakpoints

  let cssVariables = ':root {\n'

  // Iterate over light theme properties
  for (const [key, value] of Object.entries(light)) {
    cssVariables += `  --${LATITUDE_PREFIX}-${key}: ${value};\n`
  }

  cssVariables += `  --${LATITUDE_PREFIX}-radius: ${theme.radius};\n`

  for (const [key, value] of Object.entries(breakpoints)) {
    cssVariables += `  --${LATITUDE_PREFIX}-breakpoint-${key}: ${value};\n`
  }

  cssVariables += '}\n.dark {\n'

  // Iterate over dark theme properties
  for (const [key, value] of Object.entries(dark)) {
    cssVariables += `  --${LATITUDE_PREFIX}-${key}: ${value};\n`
  }

  cssVariables += '}'

  return cssVariables
}
