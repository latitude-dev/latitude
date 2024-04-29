<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { Check } from "radix-icons-svelte";
  import { theme as client } from '@latitude-data/client'
  const { cn } = client.utils

  type $$Props = DropdownMenuPrimitive.CheckboxItemProps

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type $$Events = DropdownMenuPrimitive.CheckboxItemEvents

  let className: $$Props["class"] = undefined;
  export let checked: $$Props["checked"] = undefined;
  export { className as class };
</script>

<DropdownMenuPrimitive.CheckboxItem
  bind:checked
  class={cn(
    "lat-relative lat-flex cursor-default lat-select-none lat-items-center lat-rounded-sm lat-py-1.5 lat-pl-8 lat-pr-2 lat-text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:lat-bg-accent data-[highlighted]:lat-text-accent-foreground data-[disabled]:opacity-50",
    className
  )}
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
    <DropdownMenuPrimitive.CheckboxIndicator>
      <Check class="lat-h-4 lat-w-4" />
    </DropdownMenuPrimitive.CheckboxIndicator>
  </span>
  <slot />
</DropdownMenuPrimitive.CheckboxItem>
