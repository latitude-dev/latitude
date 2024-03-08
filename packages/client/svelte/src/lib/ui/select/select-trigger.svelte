<script lang="ts">
  import { Select as SelectPrimitive } from "bits-ui";
  import { CaretSort } from "radix-icons-svelte";
  import { theme } from '@latitude-data/client'

  type $$Props = SelectPrimitive.TriggerProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<SelectPrimitive.Trigger
  class={theme.ui.select.trigger.cssClass({ className })}
  {...$$restProps}
>
  <slot />
  <div>
    <CaretSort class={theme.ui.select.trigger.ICON_CSS_CLASS} />
  </div>
</SelectPrimitive.Trigger>
