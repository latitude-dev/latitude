<script lang="ts">
  import { Command as CommandPrimitive } from "cmdk-sv";
  import { theme } from "@latitude-data/client"

  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<CommandPrimitive.Group
  class={theme.ui.command.group.cssClass({ className })}
  {...$$restProps}
>
  <slot />
</CommandPrimitive.Group>
