<script lang="ts">
  import { ScrollArea as ScrollAreaPrimitive } from "bits-ui";
  import { theme } from '@latitude-data/client'

  type $$Props = ScrollAreaPrimitive.ScrollbarProps & {
    orientation?: "vertical" | "horizontal";
  };

  let className: $$Props["class"] = undefined;
  export let orientation: $$Props["orientation"] = "vertical";
  export { className as class };
</script>

<ScrollAreaPrimitive.Scrollbar
  {orientation}
  class={theme.ui.scrollArea.scrollbar.cssClass({ className, orientation })}
>
  <slot />
  <ScrollAreaPrimitive.Thumb
    class={theme.ui.scrollArea.scrollbar.thumbCssClass({ orientation })}
  />
</ScrollAreaPrimitive.Scrollbar>
