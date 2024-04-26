<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { DotFilled } from "radix-icons-svelte";
  import { theme as client } from '@latitude-data/client'
  const { cn } = client.utils

  type $$Props = DropdownMenuPrimitive.RadioItemProps;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type $$Events = DropdownMenuPrimitive.RadioItemEvents;

  let className: $$Props["class"] = undefined;
  export let value: DropdownMenuPrimitive.RadioItemProps["value"];
  export { className as class };
</script>

<DropdownMenuPrimitive.RadioItem
  class={cn(
    "lat-relative lat-flex cursor-default lat-select-none lat-items-center lat-rounded-sm lat-py-1.5 lat-pl-8 lat-pr-2 lat-text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:lat-bg-accent data-[highlighted]:lat-text-accent-foreground data-[disabled]:opacity-50",
    className
  )}
  {value}
  {...$$restProps}
  on:click
  on:keydown
  on:focusin
  on:focusout
  on:pointerdown
  on:pointerleave
  on:pointermove
>
  <span class="lat-absolute lat-left-2 lat-flex lat-h-3.5 lat-w-3.5 lat-items-center lat-justify-center">
    <DropdownMenuPrimitive.RadioIndicator>
      <DotFilled class="lat-h-4 lat-w-4 fill-current" />
    </DropdownMenuPrimitive.RadioIndicator>
  </span>
  <slot />
</DropdownMenuPrimitive.RadioItem>
