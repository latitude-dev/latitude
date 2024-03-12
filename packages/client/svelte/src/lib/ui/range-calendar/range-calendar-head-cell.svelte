<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  type $$Props = RangeCalendarPrimitive.HeadCellProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<RangeCalendarPrimitive.HeadCell
  class={theme.ui.calendar.headCell.cssClass({ className })}
  {...$$restProps}
>
  <slot />
</RangeCalendarPrimitive.HeadCell>
