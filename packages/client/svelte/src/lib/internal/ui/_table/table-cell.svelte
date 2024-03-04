<script lang="ts">
  import { theme } from '@latitude-data/client'
  import type { HTMLTdAttributes } from 'svelte/elements'

  type $$Props = HTMLTdAttributes

  let className: $$Props['class'] = undefined

  export { className as class }
</script>

<td
  class={theme.ui.table.cell.cssClass({ className })}
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</td>
