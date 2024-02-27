<script lang="ts">
  import ThemeProvider from '$lib/ui/theme-wrapper'
  import { Input } from '$lib'
  import { theme } from '@latitude-sdk/client'

  const defaultTheme = theme.skins.themes[1]
</script>

<ThemeProvider theme={defaultTheme} />

<Input name="foo" />
