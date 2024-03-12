<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
  import { ChevronRight } from "radix-icons-svelte";
  import { theme } from "@latitude-data/client"

  type $$Props = RangeCalendarPrimitive.NextButtonProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<RangeCalendarPrimitive.NextButton
  on:click
  class={theme.ui.calendar.nextButton.cssClass({ className })}
  {...$$restProps}
  let:builder
>
  <slot {builder}>
    <ChevronRight class={theme.ui.calendar.nextButton.ICON_CSS_CLASS} />
  </slot>
</RangeCalendarPrimitive.NextButton>
