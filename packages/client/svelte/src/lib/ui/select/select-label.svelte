<script lang="ts">
  import { Select as SelectPrimitive } from "bits-ui";
  import { theme } from '@latitude-data/client'

  type $$Props = SelectPrimitive.LabelProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<SelectPrimitive.Label class={theme.ui.select.label.cssClass({ className })} {...$$restProps}>
  <slot />
</SelectPrimitive.Label>
