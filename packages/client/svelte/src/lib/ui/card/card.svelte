<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { theme } from '@latitude-sdk/client'

  type $$Props = HTMLAttributes<HTMLDivElement>;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class={theme.ui.card.rootCssClass({ className })}
  {...$$restProps}
  on:click
  on:focusin
  on:focusout
  on:mouseenter
  on:mouseleave
>
  <slot />
</div>
