<script lang="ts">
  import { theme } from '@latitude-data/client'
  import type { HTMLTableAttributes } from 'svelte/elements'

  type $$Props = HTMLTableAttributes

  let className: $$Props['class'] = undefined

  export { className as class }
</script>

<div class={theme.ui.table.container.cssClass({ className })}>
  <table class={theme.ui.table.root.cssClass({})} {...$$restProps}>
    <slot />
  </table>
</div>
