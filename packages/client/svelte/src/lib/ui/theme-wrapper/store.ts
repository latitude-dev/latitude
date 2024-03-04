import { persisted } from 'svelte-persisted-store'
import { theme } from '@latitude-data/client'

export const themeConfig = persisted<theme.skins.Theme>(
  'themeConfig',
  theme.skins.defaultTheme,
)
