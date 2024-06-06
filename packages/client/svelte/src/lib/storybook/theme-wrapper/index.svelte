<script lang="ts">
  import { theme as client } from '@latitude-data/client'
  const { cn } = client.utils
  import { themeConfig } from './store'
  import ThemeSwitcher from './switcher'
  import { ThemeProvider } from '$lib'

  export let layout: 'centered' | 'fullscreen' = 'centered'
</script>

<ThemeProvider theme={$themeConfig}>
  <div
    class="lat-absolute lat-inset-0 lat-flex lat-flex-col lat-gap-y-4 lat-p-4"
  >
    <ThemeSwitcher />

    <div
      class={cn('lat-h-full lat-w-full', {
        'lat-flex lat-items-center lat-justify-center': layout === 'centered',
      })}
    >
      <slot />
    </div>
  </div>
</ThemeProvider>
