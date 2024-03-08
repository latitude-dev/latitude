<script lang="ts">
  import { theme } from '@latitude-data/client'
  import type { HTMLAttributes } from 'svelte/elements'

  type $$Props = HTMLAttributes<HTMLTableSectionElement>

  let className: $$Props['class'] = undefined
  export { className as class }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<thead
  class={theme.ui.table.header.cssClass({ className })}
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</thead>
