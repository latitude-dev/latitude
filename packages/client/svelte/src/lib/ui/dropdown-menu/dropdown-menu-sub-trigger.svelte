<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { theme as client } from '@latitude-data/client'
  const { cn } = client.utils
  import { ChevronRight } from "radix-icons-svelte";

  type $$Props = DropdownMenuPrimitive.SubTriggerProps & {
    inset?: boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type $$Events = DropdownMenuPrimitive.SubTriggerEvents;

  let className: $$Props["class"] = undefined;
  export let inset: $$Props["inset"] = undefined;
  export { className as class };
</script>

<DropdownMenuPrimitive.SubTrigger
  class={cn(
    "lat-flex cursor-default lat-select-none lat-items-center lat-rounded-sm lat-px-2 lat-py-1.5 lat-text-sm outline-none data-[highlighted]:lat-bg-accent data-[state=open]:lat-bg-accent data-[highlighted]:lat-text-accent-foreground data-[state=open]:lat-text-accent-foreground",
    inset && "lat-pl-8",
    className
  )}
  {...$$restProps}
  on:click
  on:keydown
  on:focusin
  on:focusout
  on:pointerleave
  on:pointermove
>
  <slot />
  <ChevronRight class="lat-ml-auto lat-h-4 lat-w-4" />
</DropdownMenuPrimitive.SubTrigger>
