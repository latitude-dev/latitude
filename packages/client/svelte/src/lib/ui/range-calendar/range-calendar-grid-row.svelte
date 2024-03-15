<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  type $$Props = RangeCalendarPrimitive.GridRowProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<RangeCalendarPrimitive.GridRow class={theme.ui.calendar.gridRow.cssClass({ className })} {...$$restProps}>
  <slot />
</RangeCalendarPrimitive.GridRow>
