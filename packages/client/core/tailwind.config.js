import { fontFamily } from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ['class'],
  content: ['./src/theme/ui/**/*.ts', './src/theme/tokens/*.ts'],
  safelist: ['dark'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--lat-border) / <alpha-value>)',
        input: 'hsl(var(--lat-input) / <alpha-value>)',
        ring: 'hsl(var(--lat-ring) / <alpha-value>)',
        background: 'hsl(var(--lat-background) / <alpha-value>)',
        foreground: 'hsl(var(--lat-foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--lat-primary) / <alpha-value>)',
          foreground: 'hsl(var(--lat-primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--lat-secondary) / <alpha-value>)',
          foreground: 'hsl(var(--lat-secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--lat-destructive) / <alpha-value>)',
          foreground: 'hsl(var(--lat-destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--lat-muted) / <alpha-value>)',
          foreground: 'hsl(var(--lat-muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--lat-accent) / <alpha-value>)',
          foreground: 'hsl(var(--lat-accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--lat-popover) / <alpha-value>)',
          foreground: 'hsl(var(--lat-popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--lat-card) / <alpha-value>)',
          foreground: 'hsl(var(--lat-card-foreground) / <alpha-value>)',
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
      screens: {
        sm: 'var(--lat-breakpoint-mobile)',
        md: 'var(--lat-breakpoint-tablet)',
        lg: 'var(--lat-breakpoint-desktop)',
        xl: 'var(--lat-breakpoint-wide)',
        '2xl': 'var(--lat-breakpoint-ultraWide)',
      },
    },
  },
}

export default config
