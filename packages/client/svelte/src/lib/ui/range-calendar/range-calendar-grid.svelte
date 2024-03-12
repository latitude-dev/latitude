<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  type $$Props = RangeCalendarPrimitive.GridProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<RangeCalendarPrimitive.Grid
  class={theme.ui.calendar.grid.cssClass({ className })}
  {...$$restProps}
>
  <slot />
</RangeCalendarPrimitive.Grid>
