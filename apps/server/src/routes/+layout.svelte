<script lang="ts">
  import { theme } from '@latitude-sdk/client'
  import { ThemeProvider } from '@latitude-sdk/svelte'
  import { updateViewParamsFromUrl } from '$lib/stores/viewParams'

  updateViewParamsFromUrl()

  const defaultTheme = theme.skins.themes[1]

  import '../assets/app.css'
</script>

<ThemeProvider theme={defaultTheme} />

<slot />
