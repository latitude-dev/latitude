<script lang="ts">
  import { setContext } from 'svelte'
  import { theme as client } from '@latitude-data/client'
  import { ModeWatcher, mode, setMode } from 'mode-watcher'
  import { derived, writable } from 'svelte/store'

  const buildCss = client.skins.buildCssVariables
  const createTheme = client.skins.createTheme

  type $$Props = {
    theme?: client.skins.PartialTheme
    mode?: 'light' | 'dark' | 'system'
  }

  const LATITUDE_STYLE_ID = 'latitude-variables'
  const { isBrowser } = client.utils

  let partialTheme: $$Props['theme'] = client.skins.defaultTheme
  export { partialTheme as theme }

  let initialMode: $$Props['mode'] = 'light'
  export { initialMode as mode }
  $: setMode(initialMode || 'light')

  const theme = writable<client.skins.Theme>(partialTheme ? createTheme(partialTheme) : client.skins.defaultTheme)
  $: if (partialTheme) theme.set(createTheme(partialTheme))
  setContext('lat_theme', theme)

  const inlineCss = derived(theme, ($theme) => buildCss($theme))

  inlineCss.subscribe((cssStyles: string) => {
    if (!isBrowser) return
    
    const styleTag = document.getElementById(LATITUDE_STYLE_ID)
    if (!styleTag) return

    styleTag.innerHTML = cssStyles
  })

  mode.subscribe((newMode) => {
    if (!isBrowser) return
    // Required for Tailwind, because adding a custom prefix also affect the `dark` class
    document.documentElement.classList.toggle('lat-dark', newMode === 'dark')
  })
  
</script>

<svelte:head>
  <!-- Terrible hack: -->
  <!-- This is necessary because Svelte is trying to parse this CSS with PostCSS -->
  <!-- https://github.com/sveltejs/svelte/issues/5292#issuecomment-787743573 -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html `<${''}style id="${LATITUDE_STYLE_ID}">${$inlineCss}</${''}style>`}
</svelte:head>

<ModeWatcher />
<slot />
