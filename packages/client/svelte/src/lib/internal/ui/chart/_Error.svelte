<script lang="ts">
  import { theme } from '@latitude-data/client'
  import Alert from '$lib/ui/alert/alert.svelte'
  export let error: Error
</script>

<div class={theme.ui.chart.ERROR_CLASS.wrapper}>
  <Alert scrollable type="error" secondary>
    {error.message}
  </Alert>
</div>
