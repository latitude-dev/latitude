<script lang="ts">
  import { Calendar as CalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<CalendarPrimitive.GridHead class={theme.ui.calendar.gridHead.cssClass({ className })} {...$$restProps}>
  <slot />
</CalendarPrimitive.GridHead>
