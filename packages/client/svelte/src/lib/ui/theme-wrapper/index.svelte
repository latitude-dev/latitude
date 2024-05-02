<script lang="ts">
  import type { Props } from './types'
  import { themeConfig } from './store'
  import { onMount } from 'svelte'
  import { theme as client } from '@latitude-data/client'
  import ThemeSwitcher from './switcher'
  import { ModeWatcher } from 'mode-watcher'

  type $$Props = Props

  const LATITUDE_STYLE_ID = 'latitude-variables'
  const { cn, isBrowser } = client.utils

  export let isStorybook: $$Props['isStorybook'] = false
  export let theme: $$Props['theme'] = client.skins.defaultTheme

  const buildCss = client.skins.buildCssVariables

  // This component is used in the real world and in Storybook
  // Storybook does not support SSR,
  // so we need to inject the CSS variables
  function updateStyles(styles: string) {
    // SSR
    if (!isBrowser) return

    const styleTag = document.getElementById(LATITUDE_STYLE_ID)
    if (!styleTag) return

    styleTag.innerHTML = styles
  }

  let inlineCss = buildCss($themeConfig ?? theme)

  $: {
    inlineCss = buildCss($themeConfig)
    updateStyles(inlineCss)
  }

  onMount(() => {
    updateStyles(inlineCss)
  })
</script>

<svelte:head>
  <!-- Terrible hack: -->
  <!-- This is necessary because Svelte is trying to parse this CSS with PostCSS -->
  <!-- https://github.com/sveltejs/svelte/issues/5292#issuecomment-787743573 -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html `<${''}style id="${LATITUDE_STYLE_ID}">${inlineCss}</${''}style>`}
</svelte:head>

<ModeWatcher defaultMode="light" />

<div class={cn({ 'lat-absolute lat-inset-0 lat-p-4 lat-flex lat-flex-col lat-gap-y-4': isStorybook })}>
  {#if isStorybook}
    <ThemeSwitcher />
  {/if}

  <div class="lat-flex lat-items-center lat-justify-center lat-h-full">
    <slot />
  </div>
</div>
