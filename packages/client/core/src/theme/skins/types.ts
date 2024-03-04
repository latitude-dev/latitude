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
}

export type ThemeName = 'latitude' | 'rose' | 'green' | 'orange'

export type ColorTheme = {
  light: ThemeColor
  dark: ThemeColor
}

type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide' | 'ultraWide'
export type Breakpoints = Record<Breakpoint, number>

export type Theme = {
  name: string
  label?: string
  radius: string
  breakpoints: Breakpoints
  colors: {
    light: ThemeColor
    dark: ThemeColor
  }
}
