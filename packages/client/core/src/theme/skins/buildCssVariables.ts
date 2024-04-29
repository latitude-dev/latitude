import { TailwindAttributes, Theme } from './types'

const LATITUDE_PREFIX = 'lat-'

function mapThemeToCssVariables(themeAttributes: TailwindAttributes): string {
  return Object.entries(themeAttributes)
    .map(([key, value]) => {
      if (typeof value !== 'string' && typeof value !== 'number') return
      return `  --${LATITUDE_PREFIX}${key}: ${value};`
    })
    .filter(Boolean)
    .join('\n')
}

export function buildCssVariables(theme: Theme): string {
  const { dark, ...light } = theme

  return `:root {
${mapThemeToCssVariables(light)}
}
.dark {
${mapThemeToCssVariables(dark)}
}`
}
