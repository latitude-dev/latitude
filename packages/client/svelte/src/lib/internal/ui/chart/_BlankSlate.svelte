<script lang="ts">
  import ChartPreview from './assets/chart-preview.svg?raw'
  import { theme } from '@latitude-data/client'
  export let isLoading: boolean = false
</script>

<div class={theme.ui.chart.blankSlateCssRoot({ loading: isLoading })}>
  <div class={theme.ui.chart.blankSlateCssContent()}>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html ChartPreview}
  </div>
</div>
