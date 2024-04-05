<script lang="ts">
  import { theme } from "@latitude-data/client"
  import type { HTMLAnchorAttributes } from "svelte/elements";

  type $$Props = Omit<HTMLAnchorAttributes, 'href' | 'target' | 'rel'> & {
    to: string;
    newTab?: boolean;
    class?: string;
  };

  let className: $$Props["class"] = undefined;
  export let to: $$Props["to"];
  export let newTab: $$Props["newTab"] = false;
</script>

<a
  class={theme.ui.link.cssClass({ className })}
  href={to}
  target={newTab ? "_blank" : undefined}
  rel={newTab ? "noopener noreferrer" : undefined}
  {...$$restProps}
>
  <slot />
</a>
