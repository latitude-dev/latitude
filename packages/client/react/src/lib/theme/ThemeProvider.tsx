import { ReactNode, useState, useEffect } from 'react'
import { theme as client } from '@latitude-data/client'
import { defaultTheme, ThemeContext } from './useTheme'

const buildCss = client.skins.buildCssVariables
const createTheme = client.skins.createTheme
type Theme = client.skins.Theme
type PartialTheme = client.skins.PartialTheme

type ThemeProviderProps = {
  theme?: PartialTheme
  children: ReactNode
}

function LatitudeThemeProvider({
  children,
  theme = defaultTheme,
}: ThemeProviderProps) {
  const [styleElement] = useState(() => {
    const style = document.createElement('style')
    document.head.appendChild(style)
    return style
  })
  const [currentTheme, setCurrentTheme] = useState<Theme>(createTheme(theme))
  const setCurrentPartialTheme = (theme: PartialTheme) => {
    setCurrentTheme(createTheme(theme))
  }

  useEffect(() => {
    const themeCss = buildCss(currentTheme)
    styleElement.innerHTML = themeCss

    return () => {
      styleElement.innerHTML = ''
    }
  }, [currentTheme, styleElement])

  return (
    <ThemeContext.Provider
      value={{ currentTheme, setCurrentTheme: setCurrentPartialTheme }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export { LatitudeThemeProvider, type ThemeProviderProps }
