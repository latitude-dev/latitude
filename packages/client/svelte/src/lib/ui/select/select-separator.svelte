<script lang="ts">
  import { Select as SelectPrimitive } from "bits-ui";
  import { theme } from '@latitude-data/client'

  type $$Props = SelectPrimitive.SeparatorProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<SelectPrimitive.Separator class={theme.ui.select.separator.cssClass({ className })} {...$$restProps} />
