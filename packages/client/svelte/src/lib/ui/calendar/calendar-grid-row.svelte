<script lang="ts">
  import { Calendar as CalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  type $$Props = CalendarPrimitive.GridRowProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<CalendarPrimitive.GridRow class={theme.ui.calendar.gridRow.cssClass({ className })} {...$$restProps}>
  <slot />
</CalendarPrimitive.GridRow>
