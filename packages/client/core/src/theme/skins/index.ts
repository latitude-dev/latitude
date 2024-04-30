// Default Skins
import rose from './tones/rose'
import orange from './tones/orange'
import green from './tones/green'

// Default Latitude Skin
import latitude from './tones/latitude'
import type { PartialTheme, Theme } from './types'

/**
 * Recursively merges the partial object with the default object.
 * The default object is used as a fallback for missing attributes in the partial object.
 */
export function defaultsDeep<T extends Record<string, unknown>>(
  partialObject: Partial<T>,
  defaultObject: T,
): T {
  return Object.keys(defaultObject).reduce((acc, key) => {
    const value =
      typeof defaultObject[key] === 'object' &&
      !Array.isArray(defaultObject[key])
        ? defaultsDeep(
            partialObject[key] || {},
            defaultObject[key] as Record<string, unknown>,
          )
        : partialObject[key] ?? defaultObject[key]
    return { ...acc, [key]: value }
  }, {} as T)
}

/**
 * Fills the "dark" attributes with default values from the "light" attributes if not provided.
 */
function completeDarkAttributes(partialTheme: PartialTheme): PartialTheme {
  const { dark: partialDark, ...light } = partialTheme
  const dark = defaultsDeep(partialDark || {}, light)
  return { ...light, dark }
}

export const defaultTheme: Theme = completeDarkAttributes(latitude) as Theme

export function createTheme(partialTheme: PartialTheme): Theme {
  // First, we add the missing dark attributes to avoid replacing them with default values
  // if they were defined in the custom light theme.
  partialTheme = completeDarkAttributes(partialTheme)

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
