<script lang="ts">
  import { theme } from '@latitude-data/client'
  import Alert from '$lib/ui/alert/alert.svelte'
  export let error: Error
  export let height: number | undefined = undefined
</script>

<div style="height: {height}px" class={theme.ui.chart.ERROR_CLASS.wrapper}>
  <Alert
    scrollable
    variant="destructive"
    class={theme.ui.chart.ERROR_CLASS.content}
  >
    {error.message}
  </Alert>
</div>
