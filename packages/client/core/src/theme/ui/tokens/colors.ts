export const colors = {
  backgrounds: {
    transparent: 'bg-transparent',
    primary: 'bg-primary',
    primary20: 'bg-primary/20',
    destructive: 'bg-destructive',
    destructive20: 'bg-destructive/20',
    destructiveForeground: 'bg-destructive-foreground',
    green100: 'bg-green-100',
    green500: 'bg-green-500',
    yellow50: 'bg-yellow-50',
    muted: 'bg-muted',
    mutedForeground: 'bg-muted-foreground'
  },
  textColors: {
    white: 'text-white',
    primary: 'text-primary',
    secondary: 'text-secondary',
    destructive: 'text-destructive',
    accent: 'text-accent',
    muted: 'text-muted',
    mutedForeground: 'text-muted-foreground',
    background: 'text-background',
    foreground: 'text-foreground',
    link: 'text-link',
    inherit: 'text-inherit',
    primaryForeground: 'text-primary-foreground',
    destructiveForeground: 'text-destructive-foreground',
    yellow900: 'text-yellow-900',
    green700: 'text-green-700',
  },
}

export type TextColor = keyof typeof colors.textColors
export type BackgroundColor = keyof typeof colors.backgrounds
