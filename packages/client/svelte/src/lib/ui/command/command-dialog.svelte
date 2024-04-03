<script lang="ts">
  import Command from "./command.svelte";
  import * as Dialog from "$lib/ui/dialog/index.js";
  import type { Dialog as DialogPrimitive } from "bits-ui";
  import type { Command as CommandPrimitive } from "cmdk-sv";
  import { theme } from "@latitude-data/client"

  type $$Props = DialogPrimitive.Props & CommandPrimitive.CommandProps;

  export let open: $$Props["open"] = false;
  export let value: $$Props["value"] = undefined;
</script>

<Dialog.Root bind:open {...$$restProps}>
  <Dialog.Content class={theme.ui.command.dialog.DIALOG_CONTENT_CSS_CLASS}>
    <Command
      class={theme.ui.command.dialog.COMMAND_CSS_CLASS}
      {...$$restProps}
      bind:value
    >
      <slot />
    </Command>
  </Dialog.Content>
</Dialog.Root>