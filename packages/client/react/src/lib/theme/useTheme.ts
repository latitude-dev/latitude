import { createContext, useContext } from 'react'
import { theme as client } from '@latitude-data/client'

const defaultLatitudeTheme = client.skins.defaultTheme

const ThemeContext = createContext({
  currentTheme: defaultLatitudeTheme,
  setCurrentTheme: (_: client.skins.Theme) => {},
})

const useLatitudeTheme = () => useContext(ThemeContext)

export { defaultLatitudeTheme, ThemeContext, useLatitudeTheme }
