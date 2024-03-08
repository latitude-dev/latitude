<script lang="ts">
  import { theme } from '@latitude-data/client'
  import type { HTMLAttributes } from 'svelte/elements'

  type $$Props = HTMLAttributes<HTMLTableRowElement> & {
    'data-state'?: unknown
  }

  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<tr
  class={theme.ui.table.row.cssClass({ className })}
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</tr>
