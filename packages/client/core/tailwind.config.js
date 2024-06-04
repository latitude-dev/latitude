import { fontFamily } from 'tailwindcss/defaultTheme'

const theme = {
  container: {
    center: true,
    padding: '2rem',
    screens: {
      '2xl': '1400px',
    },
  },
  extend: {
    colors: {
      border: 'var(--lat-border)',
      input: 'var(--lat-input)',
      ring: 'var(--lat-ring)',
      background: 'var(--lat-background)',
      foreground: 'var(--lat-foreground)',
      primary: {
        DEFAULT: 'var(--lat-primary)',
        foreground: 'var(--lat-primary-foreground)',
      },
      secondary: {
        DEFAULT: 'var(--lat-secondary)',
        foreground: 'var(--lat-secondary-foreground)',
      },
      destructive: {
        DEFAULT: 'var(--lat-destructive)',
        foreground: 'var(--lat-destructive-foreground)',
      },
      muted: {
        DEFAULT: 'var(--lat-muted)',
        foreground: 'var(--lat-muted-foreground)',
      },
      accent: {
        DEFAULT: 'var(--lat-accent)',
        foreground: 'var(--lat-accent-foreground)',
      },
      popover: {
        DEFAULT: 'var(--lat-popover)',
        foreground: 'var(--lat-popover-foreground)',
      },
      card: {
        DEFAULT: 'var(--lat-card)',
        foreground: 'var(--lat-card-foreground)',
      },
    },
    borderRadius: {
      lg: 'var(--lat-radius)',
      md: 'calc(var(--lat-radius) - 2px)',
      sm: 'calc(var(--lat-radius) - 4px)',
    },
    fontFamily: {
      sans: [...fontFamily.sans],
    },
    keyframes: {
      gradient: {
        '0%': {
          'background-size': '200% 200%',
          'background-position': '200% 50%',
        },
        '100%': {
          'background-size': '200% 200%',
          'background-position': '0% 50%',
        },
      },
    },
    animation: {
      gradient: 'gradient 2s linear infinite',
    },
  },
}

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ['selector'],
  content: [
    './src/theme/ui/**/*.ts',
    './src/theme/tokens/*.ts',
  ],
  theme,
  prefix: 'lat-',
}

export { theme }
export default config
