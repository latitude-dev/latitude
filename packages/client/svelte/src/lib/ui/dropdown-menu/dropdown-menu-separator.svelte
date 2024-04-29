<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { theme as client } from '@latitude-data/client'
  const { cn } = client.utils

  type $$Props = DropdownMenuPrimitive.SeparatorProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<DropdownMenuPrimitive.Separator
  class={cn("-lat-mx-1 lat-my-1 lat-h-px lat-bg-muted", className)}
  {...$$restProps}
/>
