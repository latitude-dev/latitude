<script>
  import { Alert, ThemeProvider } from '@latitude-data/svelte'

  import '../assets/app.css'
  import '@latitude-data/svelte/styles.css'

  import { onMount } from 'svelte'
  import { init as initQueries } from '$lib/stores/queries'
  import { setUrlParam, useViewParams } from '$lib/stores/viewParams'
  import { initIframeCommunication } from '$lib/iframeEmbedding'
  import { browser } from '$app/environment'
  import { config } from '$lib/stores/config'

  /**
   * FIXME: https://github.com/latitude-dev/latitude/issues/158
   * @type {import('./$types').LayoutServerData}
   */
  export let data
  const validToken = data.valid
  const tokenError = data.errorMessage
  if (browser) config.set(data.config)

  onMount(async () => {
    await initQueries()

    const iframe = initIframeCommunication({ allowedOrigins: ['*'] })

    useViewParams().subscribe((params) => {
      setUrlParam(params)
      iframe.sendParamsChanged(params)
    })
  })
</script>

<ThemeProvider theme={$config?.theme ?? {}} mode={$config?.themeMode}>
  <div>
    {#if validToken}
      <slot />
    {:else}
      <div class="mt-20 container flex justify-center">
        <Alert type="error" secondary>{tokenError}</Alert>
      </div>
    {/if}
  </div>
</ThemeProvider>
