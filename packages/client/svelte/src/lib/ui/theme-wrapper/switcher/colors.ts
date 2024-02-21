import { theme } from '@latitude-sdk/client'

const latitude = theme.skins.themes[0].cssVars
const rose = theme.skins.themes[1].cssVars
const green = theme.skins.themes[2].cssVars
const orange = theme.skins.themes[3].cssVars

export const COLORS = {
  latitude: {
    light: latitude.light.primary,
    dark: latitude.dark.primary,
  },
  rose: {
    light: rose.light.primary,
    dark: rose.dark.primary,
  },
  green: {
    light: green.light.primary,
    dark: green.dark.primary,
  },
  orange: {
    light: orange.light.primary,
    dark: orange.dark.primary,
  },
}

export const COLOR_KEYS = Object.keys(COLORS) as Array<keyof typeof COLORS>
