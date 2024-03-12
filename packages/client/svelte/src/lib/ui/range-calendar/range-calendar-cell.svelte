<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  type $$Props = RangeCalendarPrimitive.CellProps;

  export let date: $$Props["date"];
  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<RangeCalendarPrimitive.Cell
  {date}
  class={theme.ui.calendar.cell.cssClass({ className, isRangeCalendar: true })}
  {...$$restProps}
>
  <slot />
</RangeCalendarPrimitive.Cell>
