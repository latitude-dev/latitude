<script lang="ts">
  import { theme } from "@latitude-data/client"
  import type { HTMLAttributes } from "svelte/elements";

  type $$Props = HTMLAttributes<HTMLDivElement>;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<div class={theme.ui.dialog.header.cssClass({ className })} {...$$restProps}>
  <slot />
</div>
