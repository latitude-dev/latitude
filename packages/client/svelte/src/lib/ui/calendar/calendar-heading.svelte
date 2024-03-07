<script lang="ts">
  import { Calendar as CalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"

  let className: string | undefined | null = undefined;
  export { className as class };
</script>

<CalendarPrimitive.Heading
  let:headingValue
  class={theme.ui.calendar.heading.cssClass({ className })}
  {...$$restProps}
>
  <slot {headingValue}>
    {headingValue}
  </slot>
</CalendarPrimitive.Heading>
