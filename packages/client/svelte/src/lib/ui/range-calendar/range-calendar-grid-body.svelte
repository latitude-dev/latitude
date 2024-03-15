<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  type $$Props = RangeCalendarPrimitive.GridBodyProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<RangeCalendarPrimitive.GridBody class={theme.ui.calendar.gridBody.cssClass({ className })} {...$$restProps}>
  <slot />
</RangeCalendarPrimitive.GridBody>
