<script lang="ts">
  import { theme } from '@latitude-data/client'
  import type { HTMLAttributes } from 'svelte/elements'

  type $$Props = HTMLAttributes<HTMLTableCaptionElement>

  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<caption
  class={theme.ui.table.caption.cssClass({ className })}
  {...$$restProps}
>
  <slot />
</caption>
