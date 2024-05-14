import { createContext, useContext } from 'react'
import { theme as client } from '@latitude-data/client'

export const themes = client.skins.themes
export const defaultTheme = client.skins.defaultTheme

type Theme = client.skins.Theme
type PartialTheme = client.skins.PartialTheme

export const ThemeContext = createContext({
  currentTheme: defaultTheme as Theme,
  setCurrentTheme: (_: Theme) => {},
})

export const useLatitudeTheme = () => useContext(ThemeContext)

export { type PartialTheme as Theme }
