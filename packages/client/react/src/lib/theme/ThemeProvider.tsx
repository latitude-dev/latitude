import { ReactNode, useState, useEffect, useMemo } from 'react'
import { theme as client } from '@latitude-data/client'
import { defaultTheme, ThemeContext } from './useTheme'
import usePrefersColorScheme from 'use-prefers-color-scheme'

const buildCss = client.skins.buildCssVariables
const createTheme = client.skins.createTheme
type Theme = client.skins.Theme
type PartialTheme = client.skins.PartialTheme

enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
}

enum ThemeModeConfig {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

type ThemeProviderProps = {
  theme?: PartialTheme
  mode?: ThemeModeConfig
  children: ReactNode
}

function LatitudeThemeProvider({
  children,
  theme: partialTheme = defaultTheme,
  mode = ThemeModeConfig.Light,
}: ThemeProviderProps) {
  const [theme, setFullTheme] = useState<Theme>(createTheme(partialTheme))
  const setTheme = (theme: PartialTheme) => {
    setFullTheme(createTheme(theme))
  }

  const prefersColorScheme = usePrefersColorScheme()
  const systemMode = useMemo<ThemeMode>(() => {
    if (Object.values(ThemeMode).includes(prefersColorScheme as ThemeMode)) {
      return prefersColorScheme as ThemeMode
    }
    return ThemeMode.Light
  }, [prefersColorScheme])

  const [styleElement] = useState(() => {
    const style = document.createElement('style')
    document.head.appendChild(style)
    return style
  })

  useEffect(() => {
    const themeCss = buildCss(theme)
    styleElement.innerHTML = themeCss

    return () => {
      styleElement.innerHTML = ''
    }
  }, [theme, styleElement])

  useEffect(() => {
    const applyDarkTheme =
      mode === ThemeModeConfig.Dark ||
      (mode === ThemeModeConfig.System && systemMode === ThemeMode.Dark)
    document.body.classList.toggle('lat-dark', applyDarkTheme)
  }, [mode, systemMode])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        mode: mode === ThemeModeConfig.System ? systemMode : mode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export { LatitudeThemeProvider, type ThemeProviderProps }
