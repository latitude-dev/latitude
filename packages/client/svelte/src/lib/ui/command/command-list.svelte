<script lang="ts">
  import { Command as CommandPrimitive } from "cmdk-sv";
  import { theme } from "@latitude-data/client"
  
  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<CommandPrimitive.List
  class={theme.ui.command.list.cssClass({ className })}
  {...$$restProps}
>
  <slot />
</CommandPrimitive.List>
