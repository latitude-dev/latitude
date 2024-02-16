export type ThemeColor = {
  background: string
  foreground: string
  card: string
  'card-foreground': string
  popover: string
  'popover-foreground': string
  primary: string
  'primary-foreground': string
  secondary: string
  'secondary-foreground': string
  muted: string
  'muted-foreground': string
  accent: string
  'accent-foreground': string
  destructive: string
  'destructive-foreground': string
  border: string
  input: string
  ring: string
  radius?: string
}
export type SkinCss = {
  light: ThemeColor
  dark: ThemeColor
}

export type ThemeName = 'latitude' | 'rose' | 'green' | 'orange'

export type Theme = {
  name: ThemeName
  label?: string
  cssVars: {
    light: ThemeColor
    dark: ThemeColor
  }
}
