export type TailwindAttributes = {
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
  radius: string
}

export type EchartTheme = Record<string, unknown> // Echarts does not provide an explicit type for themes https://github.com/apache/echarts/issues/18770

export type ThemeAttributes = TailwindAttributes & {
  echarts: EchartTheme
}

export type Theme = ThemeAttributes & {
  dark: ThemeAttributes
}

export type PartialThemeAttributes = Partial<TailwindAttributes> & {
  echarts?: Partial<EchartTheme>
}

export type PartialTheme = PartialThemeAttributes & {
  dark?: PartialThemeAttributes
}
