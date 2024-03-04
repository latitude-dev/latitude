// Default Skins
import rose from './tones/rose'
import orange from './tones/orange'
import green from './tones/green'

// Default Latitude Skin
import latitude from './tones/latitude'
import type { Breakpoints, Theme } from './types'

const breakpoints: Breakpoints = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
  ultraWide: 1536,
}

const DEFAULT_THEME = {
  radius: '0.5rem',
  breakpoints,
}

export const themes: Theme[] = [
  { ...DEFAULT_THEME, name: 'latitude', label: 'Latitude', colors: latitude },
  { ...DEFAULT_THEME, name: 'rose', label: 'Rose', colors: rose },
  { ...DEFAULT_THEME, name: 'green', label: 'Green', colors: green },
  { ...DEFAULT_THEME, name: 'orange', label: 'Orange', colors: orange },
]

export const defaultTheme = themes[0] as unknown as Theme
export * from './buildCssVariables'

export * from './types'
