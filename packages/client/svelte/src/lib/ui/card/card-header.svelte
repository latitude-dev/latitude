<script context="module" lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  export type Props = HTMLAttributes<HTMLDivElement>
</script>

<script lang="ts">
  import { theme } from '@latitude-data/client'

  let className: Props['class'] = undefined

  export { className as class }
</script>

<div class={theme.ui.card.headerCssClass({ className })} {...$$restProps}>
  <slot />
</div>
