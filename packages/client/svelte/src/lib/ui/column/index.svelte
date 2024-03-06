<script context="module" lang="ts">
  export type Props = {
    class?: string
  }
</script>

<script lang="ts">
  import { theme } from '@latitude-data/client'

  type $$Props = Props

  let className: $$Props['class'] = undefined
  export { className as class }

  $: classes = theme.ui.column.cssClass({ className })
</script>

<div class={classes}>
  <slot />
</div>
