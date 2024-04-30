import { createContext, useContext } from 'react'
import { theme as client } from '@latitude-data/client'

const themes = client.skins.themes
const defaultTheme = client.skins.defaultTheme

type Theme = client.skins.Theme
type PartialTheme = client.skins.PartialTheme

const ThemeContext = createContext({
  currentTheme: defaultTheme as Theme,
  setCurrentTheme: (_: Theme) => {},
})

const useLatitudeTheme = () => useContext(ThemeContext)

export {
  themes,
  defaultTheme,
  ThemeContext,
  useLatitudeTheme,
  type PartialTheme as Theme,
}
