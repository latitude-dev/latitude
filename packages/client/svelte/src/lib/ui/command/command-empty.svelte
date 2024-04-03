<script lang="ts">
  import { Command as CommandPrimitive } from "cmdk-sv";
  import { theme } from "@latitude-data/client"
  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<CommandPrimitive.Empty class={theme.ui.command.empty.cssClass({ className })} {...$$restProps}>
  <slot />
</CommandPrimitive.Empty>
