<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { theme as client } from '@latitude-data/client'
  const { cn } = client.utils
  import { flyAndScale } from "../../utils";

  type $$Props = DropdownMenuPrimitive.ContentProps;

  let className: $$Props["class"] = undefined;
  export let sideOffset: $$Props["sideOffset"] = 4;
  export let transition: $$Props["transition"] = flyAndScale;
  export let transitionConfig: $$Props["transitionConfig"] = undefined;
  export { className as class };
</script>

<DropdownMenuPrimitive.Content
  {transition}
  {transitionConfig}
  {sideOffset}
  class={cn(
    "lat-z-50 lat-min-w-[8rem] lat-rounded-md lat-border lat-bg-popover lat-p-1 lat-text-popover-foreground shadow-md focus:outline-none",
    className
  )}
  {...$$restProps}
  on:keydown
>
  <slot />
</DropdownMenuPrimitive.Content>
