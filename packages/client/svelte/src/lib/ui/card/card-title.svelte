<script context="module" lang="ts">
  export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  export type Props = HTMLAttributes<HTMLHeadingElement> & {
    tag?: HeadingLevel
  }
</script>

<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import { theme } from '@latitude-sdk/client'

  let className: Props['class'] = undefined
  export let tag: Props['tag'] = 'h3'
  export { className as class }
</script>

<svelte:element
  this={tag}
  class={theme.ui.card.titleCssClass({ className })}
  {...$$restProps}
>
  <slot />
</svelte:element>
