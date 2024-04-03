<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  type $$Props = DialogPrimitive.DescriptionProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<DialogPrimitive.Description
  class={theme.ui.dialog.description.cssClass({ className })}
  {...$$restProps}
>
  <slot />
</DialogPrimitive.Description>
