<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";
  import * as Dialog from "./index.js";
  import { flyAndScale } from "$lib/utils.js";
  import { theme } from "@latitude-data/client"
  import { Cross2 } from "radix-icons-svelte";

  type $$Props = DialogPrimitive.ContentProps;

  let className: $$Props["class"] = undefined;
  export let transition: $$Props["transition"] = flyAndScale;
  export let transitionConfig: $$Props["transitionConfig"] = {
    duration: 200,
  };
  export { className as class };
</script>

<Dialog.Portal>
  <Dialog.Overlay />
  <DialogPrimitive.Content
    {transition}
    {transitionConfig}
    class={theme.ui.dialog.content.cssClass({ className })}
    {...$$restProps}
  >
    <slot />
    <DialogPrimitive.Close
      class={theme.ui.dialog.content.CLOSE_BUTTON_CSS_CLASS}
    >
      <Cross2 class={theme.ui.dialog.content.CLOSE_ICON_CSS_CLASS} />
      <span class={theme.ui.dialog.content.CLOSE_LABEL_CSS_CLASS}>Close</span>
    </DialogPrimitive.Close>
  </DialogPrimitive.Content>
</Dialog.Portal>
