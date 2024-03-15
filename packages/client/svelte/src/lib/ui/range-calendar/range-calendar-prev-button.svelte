<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
  import { ChevronLeft } from "radix-icons-svelte";
  import { theme } from "@latitude-data/client"

  type $$Props = RangeCalendarPrimitive.PrevButtonProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<RangeCalendarPrimitive.PrevButton
  on:click
  class={theme.ui.calendar.prevButton.cssClass({ className })}
  {...$$restProps}
  let:builder
>
  <slot {builder}>
    <ChevronLeft class={theme.ui.calendar.prevButton.ICON_CSS_CLASS} />
  </slot>
</RangeCalendarPrimitive.PrevButton>
