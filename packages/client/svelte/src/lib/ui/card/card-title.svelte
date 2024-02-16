<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { theme } from '@latitude-sdk/client'
  import type { HeadingLevel } from ".";

  type $$Props = HTMLAttributes<HTMLHeadingElement> & {
    tag?: HeadingLevel;
  };

  let className: $$Props["class"] = undefined;
  export let tag: $$Props["tag"] = "h3";
  export { className as class };
</script>

<svelte:element
  this={tag}
  class={theme.ui.card.titleCssClass({ className })}
  {...$$restProps}
>
  <slot />
</svelte:element>
