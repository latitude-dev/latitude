<script lang="ts">
  import { Command as CommandPrimitive } from "cmdk-sv";
  import { theme } from "@latitude-data/client"

  export let asChild = false;

  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<CommandPrimitive.Item
  {asChild}
  class={theme.ui.command.item.cssClass({ className })}
  {...$$restProps}
  let:action
  let:attrs
>
  <slot {action} {attrs} />
</CommandPrimitive.Item>
