<script lang="ts">
  import { theme } from '@latitude-data/client'
  import type { HTMLThAttributes } from 'svelte/elements'

  type $$Props = HTMLThAttributes

  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<th class={theme.ui.table.head.cssClass({ className })} {...$$restProps}>
  <slot />
</th>
