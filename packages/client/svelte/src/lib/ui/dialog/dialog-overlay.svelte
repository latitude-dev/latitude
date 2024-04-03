<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"
  import { fade } from "svelte/transition";

  type $$Props = DialogPrimitive.OverlayProps;

  let className: $$Props["class"] = undefined;
  export let transition: $$Props["transition"] = fade;
  export let transitionConfig: $$Props["transitionConfig"] = {
    duration: 150,
  };
  export { className as class };
</script>

<DialogPrimitive.Overlay
  {transition}
  {transitionConfig}
  class={theme.ui.dialog.overlay.cssClass({ className })}
  {...$$restProps}
/>
