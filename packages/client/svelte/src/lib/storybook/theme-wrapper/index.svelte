<script lang="ts">
  import { themeConfig } from './store'
  import ThemeSwitcher from './switcher'
  import { ThemeProvider } from '$lib'
</script>

<ThemeProvider theme={$themeConfig}>
  <div class='lat-absolute lat-inset-0 lat-p-4 lat-flex lat-flex-col lat-gap-y-4'>
    <ThemeSwitcher />

    <div class="lat-flex lat-items-center lat-justify-center lat-h-full">
      <slot />
    </div>
  </div>
</ThemeProvider>