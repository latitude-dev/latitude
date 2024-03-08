<script lang="ts">
  import { Calendar as CalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  type $$Props = CalendarPrimitive.DayProps;

  export let date: $$Props["date"];
  export let month: $$Props["month"];
  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<CalendarPrimitive.Day
  on:click
  {date}
  {month}
  class={theme.ui.calendar.day.cssClass({ className })}
  {...$$restProps}
  let:selected
  let:disabled
  let:unavailable
  let:builder
>
  <slot {selected} {disabled} {unavailable} {builder}>
    {date.day}
  </slot>
</CalendarPrimitive.Day>
