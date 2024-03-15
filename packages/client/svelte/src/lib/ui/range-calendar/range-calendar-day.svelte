<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  type $$Props = RangeCalendarPrimitive.DayProps;

  export let date: $$Props["date"];
  export let month: $$Props["month"];
  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<RangeCalendarPrimitive.Day
  on:click
  {date}
  {month}
  class={theme.ui.calendar.day.cssClass({ className, isRangeCalendar: true })}
  {...$$restProps}
  let:disabled
  let:unavailable
  let:builder
>
  <slot {disabled} {unavailable} {builder}>
    {date.day}
  </slot>
</RangeCalendarPrimitive.Day>
