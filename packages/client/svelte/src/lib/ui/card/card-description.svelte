<script context="module" lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  export type Props = HTMLAttributes<HTMLParagraphElement>
</script>

<script lang="ts">
  import { theme } from '@latitude-data/client'

  let className: Props['class'] = undefined
  export { className as class }
</script>

<p class={theme.ui.card.descriptionCssClass({ className })} {...$$restProps}>
  <slot />
</p>
