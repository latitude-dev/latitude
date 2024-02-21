import { describe, it, expect } from 'vitest'
import { buildCssVariables } from './buildCssVariables'
import { defaultTheme } from './index'

function formatCssVariables(cssVariables: string) {
  // Add 6 spaces to each line. The first line has 4 spaces
  // the `}` has 4 spaces. The `.dart {` has 4 spaces`
  return cssVariables
    .split('\n')
    .map((line, index) => {
      if (index === 0) return line

      return `      ${line}`
    })
    .join('\n')
}

describe('build css variables', () => {
  it('receives a Latitude theme and print css variables syntax', () => {
    const light = defaultTheme.cssVars.light
    const dark = defaultTheme.cssVars.dark
    const cssVariables = formatCssVariables(buildCssVariables(defaultTheme))

    expect(cssVariables).toEqual(
      `:root {
        --lat-background: ${light.background};
        --lat-foreground: ${light.foreground};
        --lat-card: ${light.card};
        --lat-card-foreground: ${light['card-foreground']};
        --lat-popover: ${light.popover};
        --lat-popover-foreground: ${light['popover-foreground']};
        --lat-primary: ${light.primary};
        --lat-primary-foreground: ${light['primary-foreground']};
        --lat-secondary: ${light.secondary};
        --lat-secondary-foreground: ${light['secondary-foreground']};
        --lat-muted: ${light.muted};
        --lat-muted-foreground: ${light['muted-foreground']};
        --lat-accent: ${light.accent};
        --lat-accent-foreground: ${light['accent-foreground']};
        --lat-destructive: ${light.destructive};
        --lat-destructive-foreground: ${light['destructive-foreground']};
        --lat-border: ${light.border};
        --lat-input: ${light.input};
        --lat-ring: ${light.ring};
        --lat-radius: ${light.radius};
      }
      .dark {
        --lat-background: ${dark.background};
        --lat-foreground: ${dark.foreground};
        --lat-card: ${dark.card};
        --lat-card-foreground: ${dark['card-foreground']};
        --lat-popover: ${dark.popover};
        --lat-popover-foreground: ${dark['popover-foreground']};
        --lat-primary: ${dark.primary};
        --lat-primary-foreground: ${dark['primary-foreground']};
        --lat-secondary: ${dark.secondary};
        --lat-secondary-foreground: ${dark['secondary-foreground']};
        --lat-muted: ${dark.muted};
        --lat-muted-foreground: ${dark['muted-foreground']};
        --lat-accent: ${dark.accent};
        --lat-accent-foreground: ${dark['accent-foreground']};
        --lat-destructive: ${dark.destructive};
        --lat-destructive-foreground: ${dark['destructive-foreground']};
        --lat-border: ${dark.border};
        --lat-input: ${dark.input};
        --lat-ring: ${dark.ring};
      }`,
    )
  })
})
