<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<RangeCalendarPrimitive.GridHead class={theme.ui.calendar.gridHead.cssClass({ className })} {...$$restProps}>
  <slot />
</RangeCalendarPrimitive.GridHead>
