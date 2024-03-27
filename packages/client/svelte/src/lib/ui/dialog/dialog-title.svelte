<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  type $$Props = DialogPrimitive.TitleProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<DialogPrimitive.Title
  class={theme.ui.dialog.title.cssClass({ className })}
  {...$$restProps}
>
  <slot />
</DialogPrimitive.Title>
