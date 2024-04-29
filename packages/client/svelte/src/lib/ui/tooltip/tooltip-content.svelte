<script lang="ts">
  import { Tooltip as TooltipPrimitive } from "bits-ui";
  import { flyAndScale } from "../../utils";
  import { theme } from "@latitude-data/client";
  const { cn } = theme.utils
  type $$Props = TooltipPrimitive.ContentProps;

  let className: $$Props["class"] = undefined;
  export let sideOffset: $$Props["sideOffset"] = 4;
  export let transition: $$Props["transition"] = flyAndScale;
  export let transitionConfig: $$Props["transitionConfig"] = {
    y: 8,
    duration: 150,
  };
  export { className as class };
</script>

<TooltipPrimitive.Content
  {transition}
  {transitionConfig}
  {sideOffset}
  class={cn(
    "lat-z-50 lat-overflow-hidden lat-rounded-md lat-bg-primary lat-px-3 lat-py-1.5 lat-text-xs lat-text-primary-foreground",
    className
  )}
  {...$$restProps}
>
  <slot />
</TooltipPrimitive.Content>
