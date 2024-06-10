import { FC } from 'react'
import { LatitudeApiProvider, type QueryClientProviderProps } from './data'
import { LatitudeThemeProvider, type ThemeProviderProps } from './lib'

type LatitudeProviderProps = QueryClientProviderProps &
  Omit<ThemeProviderProps, 'theme'> & {
    theme?: false | ThemeProviderProps['theme']
  }

const LatitudeProvider: FC<LatitudeProviderProps> = ({
  children,
  theme,
  mode,
  ...props
}: LatitudeProviderProps) => {
  return (
    <LatitudeApiProvider {...props}>
      {theme !== false ? (
        <LatitudeThemeProvider theme={theme} mode={mode}>
          {children}
        </LatitudeThemeProvider>
      ) : (
        children
      )}
    </LatitudeApiProvider>
  )
}

export default LatitudeProvider
