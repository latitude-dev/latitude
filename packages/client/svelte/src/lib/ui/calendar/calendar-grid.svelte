<script lang="ts">
  import { Calendar as CalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  type $$Props = CalendarPrimitive.GridProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<CalendarPrimitive.Grid class={theme.ui.calendar.grid.cssClass({ className })} {...$$restProps}>
  <slot />
</CalendarPrimitive.Grid>
