<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { theme as client } from '@latitude-data/client'
  const { cn } = client.utils
  import { flyAndScale } from "../../utils";

  type $$Props = DropdownMenuPrimitive.SubContentProps;

  let className: $$Props["class"] = undefined;
  export let transition: $$Props["transition"] = flyAndScale;
  export let transitionConfig: $$Props["transitionConfig"] = {
    x: -10,
    y: 0,
  };
  export { className as class };
</script>

<DropdownMenuPrimitive.SubContent
  {transition}
  {transitionConfig}
  class={cn(
    "lat-z-50 lat-min-w-[8rem] lat-rounded-md lat-border lat-bg-popover lat-p-1 lat-text-popover-foreground shadow-lg focus:outline-none",
    className
  )}
  {...$$restProps}
  on:keydown
  on:focusout
  on:pointermove
>
  <slot />
</DropdownMenuPrimitive.SubContent>
