<script lang="ts">
  import { Button as ButtonPrimitive } from "bits-ui";
  import { theme } from '@latitude-sdk/client'
  import { type Props, type Events } from "./types";

  type $$Props = Props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type $$Events = Events;

  export let variant: $$Props["variant"] = "default";
  export let size: $$Props["size"] = "default";
  export let builders: $$Props["builders"] = [];
</script>

<ButtonPrimitive.Root
  {builders}
  type="button"
  class={theme.ui.button.cssClass({ variant, size })}
  {...$$restProps}
  on:click
  on:keydown
>
  <slot />
</ButtonPrimitive.Root>
