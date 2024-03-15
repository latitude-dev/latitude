<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<RangeCalendarPrimitive.Heading
  let:headingValue
  class={theme.ui.calendar.heading.cssClass({ className })}
  {...$$restProps}
>
  <slot {headingValue}>
    {headingValue}
  </slot>
</RangeCalendarPrimitive.Heading>
