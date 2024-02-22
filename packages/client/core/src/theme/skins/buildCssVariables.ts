import { Theme } from './types'

const LATITUDE_PREFIX = 'lat'

export function buildCssVariables(theme: Theme) {
  const light = theme.cssVars.light
  const dark = theme.cssVars.dark

  let cssVariables = ':root {\n'

  // Iterate over light theme properties
  for (const [key, value] of Object.entries(light)) {
    cssVariables += `  --${LATITUDE_PREFIX}-${key}: ${value};\n`
  }

  cssVariables += '}\n.dark {\n'

  // Iterate over dark theme properties
  for (const [key, value] of Object.entries(dark)) {
    cssVariables += `  --${LATITUDE_PREFIX}-${key}: ${value};\n`
  }

  cssVariables += '}'

  return cssVariables
}
