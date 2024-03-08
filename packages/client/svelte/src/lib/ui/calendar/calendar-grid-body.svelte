<script lang="ts">
  import { Calendar as CalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  type $$Props = CalendarPrimitive.GridBodyProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<CalendarPrimitive.GridBody
  class={theme.ui.calendar.gridBody.cssClass({ className })}
  {...$$restProps}
>
  <slot />
</CalendarPrimitive.GridBody>
