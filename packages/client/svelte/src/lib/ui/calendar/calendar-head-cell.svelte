<script lang="ts">
  import { Calendar as CalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  type $$Props = CalendarPrimitive.HeadCellProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<CalendarPrimitive.HeadCell
  class={theme.ui.calendar.headCell.cssClass({ className })}
  {...$$restProps}
>
  <slot />
</CalendarPrimitive.HeadCell>
