<script lang="ts">
  import { theme } from '@latitude-data/client'
  import type { HTMLAttributes } from 'svelte/elements'

  type $$Props = HTMLAttributes<HTMLTableSectionElement>

  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<tbody class={theme.ui.table.body.cssClass({ className })} {...$$restProps}>
  <slot />
</tbody>
