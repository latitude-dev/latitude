// Default Skins
import rose from './tones/rose'
import orange from './tones/orange'
import green from './tones/green'

// Default Latitude Skin
import latitude from './tones/latitude'
import type { Theme } from './types'

export const themes: Theme[] = [
  { name: 'latitude', label: 'Latitude', cssVars: latitude },
  { name: 'rose', label: 'Rose', cssVars: rose },
  { name: 'green', label: 'Green', cssVars: green },
  { name: 'orange', label: 'Orange', cssVars: orange },
]

export const defaultTheme = themes[0] as unknown as Theme
export * from './buildCssVariables'

export * from './types'
