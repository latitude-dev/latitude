<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { theme } from '@latitude-sdk/client'

  type $$Props = HTMLAttributes<HTMLParagraphElement>;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<p class={theme.ui.card.descriptionCssClass({ className })} {...$$restProps}>
  <slot />
</p>
