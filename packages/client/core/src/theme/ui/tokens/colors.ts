export const colors = {
  backgrounds: {
    transparent: 'lat-bg-transparent',
    primary: 'lat-bg-primary',
    primary20: 'lat-bg-primary/20',
    destructive: 'lat-bg-destructive',
    destructive20: 'lat-bg-destructive/20',
    destructiveForeground: 'lat-bg-destructive-foreground',
    green100: 'lat-bg-green-100',
    green500: 'lat-bg-green-500',
    yellow50: 'lat-bg-yellow-50',
    yellow400: 'lat-bg-yellow-400',
    muted: 'lat-bg-muted',
    mutedForeground: 'lat-bg-muted-foreground',
  },
  textColors: {
    white: 'lat-text-white',
    primary: 'lat-text-primary',
    secondary: 'lat-text-secondary',
    destructive: 'lat-text-destructive',
    accent: 'lat-text-accent',
    muted: 'lat-text-muted',
    mutedForeground: 'lat-text-muted-foreground',
    background: 'lat-text-background',
    foreground: 'lat-text-foreground',
    link: 'lat-text-link',
    inherit: 'lat-text-inherit',
    primaryForeground: 'lat-text-primary-foreground',
    destructiveForeground: 'lat-text-destructive-foreground',
    yellow900: 'lat-text-yellow-900',
    green700: 'lat-text-green-700',
    gray800: 'lat-text-gray-800',
  },
}

export type TextColor = keyof typeof colors.textColors
export type BackgroundColor = keyof typeof colors.backgrounds
