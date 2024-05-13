import { LatitudeApiProvider, type QueryClientProviderProps } from './data'
import { LatitudeThemeProvider, type ThemeProviderProps } from './lib'

type LatitudeProviderProps = QueryClientProviderProps &
  Omit<ThemeProviderProps, 'theme'> & {
    theme?: false | ThemeProviderProps['theme']
  }

function LatitudeProvider({
  children,
  theme,
  ...props
}: LatitudeProviderProps) {
  return (
    <LatitudeApiProvider {...props}>
      {theme !== false ? (
        <LatitudeThemeProvider theme={theme} {...props}>
          {children}
        </LatitudeThemeProvider>
      ) : (
        children
      )}
    </LatitudeApiProvider>
  )
}

export default LatitudeProvider
