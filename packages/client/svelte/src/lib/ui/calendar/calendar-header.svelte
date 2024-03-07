<script lang="ts">
  import { Calendar as CalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  type $$Props = CalendarPrimitive.HeaderProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<CalendarPrimitive.Header
  class={theme.ui.calendar.header.cssClass({ className })}
  {...$$restProps}
>
  <slot />
</CalendarPrimitive.Header>
