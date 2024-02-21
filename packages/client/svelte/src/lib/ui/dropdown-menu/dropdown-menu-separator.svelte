<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
  import { theme as client } from '@latitude-sdk/client'
  const { cn } = client.utils

  type $$Props = DropdownMenuPrimitive.SeparatorProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<DropdownMenuPrimitive.Separator
  class={cn("-mx-1 my-1 h-px bg-muted", className)}
  {...$$restProps}
/>
