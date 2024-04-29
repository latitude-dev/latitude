<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { theme as client } from '@latitude-data/client'
  const { cn } = client.utils

  type $$Props = DropdownMenuPrimitive.ItemProps & {
    inset?: boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type $$Events = DropdownMenuPrimitive.ItemEvents;

  let className: $$Props["class"] = undefined;
  export let inset: $$Props["inset"] = undefined;
  export { className as class };
</script>

<DropdownMenuPrimitive.Item
  class={cn(
    "lat-relative lat-flex cursor-default lat-select-none lat-items-center lat-rounded-sm lat-px-2 lat-py-1.5 lat-text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:lat-bg-accent data-[highlighted]:lat-text-accent-foreground data-[disabled]:opacity-50",
    inset && "lat-pl-8",
    className
  )}
  on:click
  on:keydown
  on:focusin
  on:focusout
  on:pointerdown
  on:pointerleave
  on:pointermove
  {...$$restProps}
>
  <slot />
</DropdownMenuPrimitive.Item>
