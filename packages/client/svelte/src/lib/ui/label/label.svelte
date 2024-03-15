<script lang="ts">
  import { Label as LabelPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"
  import Text from "../text/Text.svelte"

  type $$Props = LabelPrimitive.Props;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<LabelPrimitive.Root
  {...$$restProps}
>
  <Text size='h5' leading='none' weight='normal' class={theme.ui.label.cssClass({ className })}>
    <slot />
  </Text>
</LabelPrimitive.Root>
