<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { theme as client } from '@latitude-data/client'
  const { cn } = client.utils

  type $$Props = DropdownMenuPrimitive.LabelProps & {
    inset?: boolean;
  };

  let className: $$Props["class"] = undefined;
  export let inset: $$Props["inset"] = undefined;
  export { className as class };
</script>

<DropdownMenuPrimitive.Label
  class={cn("lat-px-2 lat-py-1.5 lat-text-sm lat-font-semibold", inset && "lat-pl-8", className)}
  {...$$restProps}
>
  <slot />
</DropdownMenuPrimitive.Label>
