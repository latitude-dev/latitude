<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { theme } from '@latitude-sdk/client'

  type $$Props = HTMLAttributes<HTMLDivElement>;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<div class={theme.ui.card.headerCssClass({ className })} {...$$restProps}>
  <slot />
</div>
