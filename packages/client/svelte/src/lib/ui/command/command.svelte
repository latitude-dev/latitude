<script lang="ts">
  import { Command as CommandPrimitive } from "cmdk-sv";
  import { theme } from "@latitude-data/client"

  type $$Props = CommandPrimitive.CommandProps;

  export let value: $$Props["value"] = undefined;

  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<CommandPrimitive.Root
  class={theme.ui.command.cssClass({ className })}
  bind:value
  {...$$restProps}
>
  <slot />
</CommandPrimitive.Root>
