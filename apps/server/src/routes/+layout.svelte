<script>
  import { theme } from '@latitude-sdk/client'
  import { ThemeProvider } from '@latitude-sdk/svelte'

  const defaultTheme = theme.skins.themes[1]

  import '../assets/app.css'
</script>

<ThemeProvider {defaultTheme} />

<slot />
