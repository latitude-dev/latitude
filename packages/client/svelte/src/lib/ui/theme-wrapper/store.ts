import { persisted } from 'svelte-persisted-store'
import { theme } from '@latitude-sdk/client'

export const themeConfig = persisted<theme.skins.Theme>(
  'themeConfig',
  theme.skins.defaultTheme,
)
