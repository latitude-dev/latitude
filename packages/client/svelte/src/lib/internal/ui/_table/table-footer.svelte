<script lang="ts">
  import { theme } from '@latitude-data/client'
  import type { HTMLAttributes } from 'svelte/elements'

  type $$Props = HTMLAttributes<HTMLTableSectionElement>

  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<tfoot class={theme.ui.table.footer.cssClass({ className })} {...$$restProps}>
  <slot />
</tfoot>
