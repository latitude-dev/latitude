// Default Skins
import rose from './tones/rose'
import orange from './tones/orange'
import green from './tones/green'

// Default Latitude Skin
import latitude from './tones/latitude'
import type { PartialTheme, Theme } from './types'
import { defaultsDeep } from './utils'
import buildEchartsTheme from './buildEchartsTheme'
import addDefaultAttributes from './addDefaultAttributes'

/**
 * Uses attributes defined in the light theme to complete missing attributes the dark version.
 * Additionally, it builds some of the Echart theme based on the regular theme attributes.
 */
function completeTheme(partialTheme: PartialTheme): PartialTheme {
  const { dark: partialDark = {}, ...partialLight } = partialTheme
  const light = addDefaultAttributes(partialLight)
  const dark = defaultsDeep(addDefaultAttributes(partialDark), light)

  const lightEcharts = defaultsDeep(
    light.echarts || {},
    buildEchartsTheme(light),
  )
  const darkEcharts = defaultsDeep(dark.echarts || {}, buildEchartsTheme(dark))

  return {
    ...light,
    echarts: lightEcharts,
    dark: { ...dark, echarts: darkEcharts },
  }
}

export const defaultTheme: Theme = completeTheme(latitude) as Theme

export function createTheme(partialTheme: PartialTheme): Theme {
  // First, we add the missing dark attributes to avoid replacing them with default values
  // if they were defined in the custom light theme.
  partialTheme = completeTheme(partialTheme)

  // Now, add any missing attributes from the default theme.
  return defaultsDeep(partialTheme as Partial<Theme>, defaultTheme)
}

export const themes: Record<string, Theme> = {
  latitude: defaultTheme as Theme,
  rose: createTheme(rose),
  green: createTheme(green),
  orange: createTheme(orange),
}

export * from './buildCssVariables'
export * from './types'
