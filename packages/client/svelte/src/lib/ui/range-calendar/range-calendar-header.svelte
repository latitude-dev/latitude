<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  type $$Props = RangeCalendarPrimitive.HeaderProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<RangeCalendarPrimitive.Header
  class={theme.ui.calendar.header.cssClass({ className })}
  {...$$restProps}
>
  <slot />
</RangeCalendarPrimitive.Header>
