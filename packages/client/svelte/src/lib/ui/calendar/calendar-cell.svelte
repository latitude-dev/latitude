<script lang="ts">
  import { Calendar as CalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  type $$Props = CalendarPrimitive.CellProps;

  export let date: $$Props["date"];
  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<CalendarPrimitive.Cell
  {date}
  class={theme.ui.calendar.cell.cssClass({ className })}
  {...$$restProps}
>
  <slot />
</CalendarPrimitive.Cell>
