import { createContext, useContext } from 'react'
import { theme as client } from '@latitude-data/client'

const themes = client.skins.themes
const defaultTheme = client.skins.defaultTheme

type Theme = client.skins.Theme
type PartialTheme = client.skins.PartialTheme
type ThemeMode = 'light' | 'dark'

const ThemeContext = createContext({
  theme: defaultTheme as Theme,
  setTheme: (_: Theme) => {},
  mode: 'light' as ThemeMode,
})

const useLatitudeTheme = () => useContext(ThemeContext)

export {
  themes,
  defaultTheme,
  ThemeContext,
  useLatitudeTheme,
  type PartialTheme as Theme,
}
