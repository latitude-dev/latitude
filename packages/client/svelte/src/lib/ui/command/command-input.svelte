<script lang="ts">
  import { Command as CommandPrimitive } from "cmdk-sv";
  import { MagnifyingGlass } from "radix-icons-svelte";
  import { theme } from "@latitude-data/client"

  let className: string | undefined | null = undefined;
  export { className as class };
  export let value: string = "";
</script>

<div class={theme.ui.command.input.WRAPPER_CSS_CLASS} data-cmdk-input-wrapper="">
  <MagnifyingGlass class={theme.ui.command.input.ICON_CSS_CLASS} />
  <CommandPrimitive.Input
    class={theme.ui.command.input.cssClass({ className })}
    {...$$restProps}
    bind:value
  />
</div>
