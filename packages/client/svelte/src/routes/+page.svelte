<script lang="ts">
  import ThemeProvider from '$lib/ui/theme-wrapper'
  import { theme } from '@latitude-sdk/client'
  import { Button, Text } from '$lib'

  const defaultTheme = theme.skins.themes[1]
</script>

<ThemeProvider theme={defaultTheme} />

<Text.H1>Header 1</Text.H1>
<Text.H2>Header 2</Text.H2>
<Text.H3>Header 3</Text.H3>
<Text.H4>Header 4</Text.H4>
<Text.H5>Header 5</Text.H5>
<Text.H6>Header 6</Text.H6>

<Button>Button</Button>
