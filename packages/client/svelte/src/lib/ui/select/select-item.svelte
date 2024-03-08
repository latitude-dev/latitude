<script lang="ts">
  import { theme } from '@latitude-data/client'
  import { Select as SelectPrimitive } from "bits-ui";
  import { Check } from "radix-icons-svelte";

  type $$Props = SelectPrimitive.ItemProps;

  let className: $$Props["class"] = undefined;
  export let value: $$Props["value"];
  export let label: $$Props["label"] = undefined;
  export let disabled: $$Props["disabled"] = undefined;
  export { className as class };
</script>

<SelectPrimitive.Item
  {value}
  {disabled}
  {label}
  class={theme.ui.select.item.cssClass({ className })}
  {...$$restProps}
  on:click
  on:pointermove
  on:focusin
>
  <span class={theme.ui.select.item.ITEM_CSS_CLASS}>
    <SelectPrimitive.ItemIndicator>
      <Check class={theme.ui.select.item.INDICATOR_CHECK_CSS_CLASS} />
    </SelectPrimitive.ItemIndicator>
  </span>
  <slot>
    {label ? label : value}
  </slot>
</SelectPrimitive.Item>
