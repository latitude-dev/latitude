import { ReactNode, useState, useEffect } from 'react'
import { theme as client } from '@latitude-data/client'
import { defaultLatitudeTheme, ThemeContext } from './useTheme'

const buildCss = client.skins.buildCssVariables

type ThemeProviderProps = {
  theme?: client.skins.Theme
  children: ReactNode
}

function LatitudeThemeProvider({
  children,
  theme = defaultLatitudeTheme,
}: ThemeProviderProps) {
  const [styleElement] = useState(() => {
    const style = document.createElement('style')
    document.head.appendChild(style)
    return style
  })
  const [currentTheme, setCurrentTheme] = useState<client.skins.Theme>(theme)

  useEffect(() => {
    const themeCss = buildCss(currentTheme)
    styleElement.innerHTML = themeCss

    return () => {
      styleElement.innerHTML = ''
    }
  }, [currentTheme, styleElement])

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export { LatitudeThemeProvider, type ThemeProviderProps }
