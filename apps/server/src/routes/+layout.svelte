<script>
  import { theme } from '@latitude-data/client'
  import { Alert, ThemeProvider } from '@latitude-data/svelte'
  const defaultTheme = theme.skins.themes[1]

  import '../assets/app.css'
  import { onMount } from 'svelte'
  import { init as initQueries } from '$lib/stores/queries'

  /**
   * FIXME: https://github.com/latitude-dev/latitude/issues/158
   * @type {import('./$types').LayoutServerData}
   */
  export let data
  const validToken = data.valid
  const tokenError = data.errorMessage

  onMount(initQueries)
</script>

<ThemeProvider theme={defaultTheme} />

<div>
  {#if validToken}
    <slot />
  {:else}
    <div class="mt-20 container flex justify-center">
      <Alert type="destructive" secondary>{tokenError}</Alert>
    </div>
  {/if}
</div>
