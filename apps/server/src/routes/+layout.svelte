<script lang="ts">
  import { theme } from '@latitude-sdk/client'
  import { ThemeProvider } from '@latitude-sdk/svelte'
  const defaultTheme = theme.skins.themes[1]

  import '../assets/app.css'
  import { onMount } from 'svelte'
  import { init as initQueries } from '$lib/stores/queries'

  onMount(initQueries)
</script>

<ThemeProvider theme={defaultTheme} />

<slot />
