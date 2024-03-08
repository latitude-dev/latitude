<script lang="ts">
  import { Calendar as CalendarPrimitive } from "bits-ui";
  import { ChevronRight } from "radix-icons-svelte";
  import { theme } from "@latitude-data/client"

  type $$Props = CalendarPrimitive.NextButtonProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<CalendarPrimitive.NextButton
  on:click
  class={theme.ui.calendar.nextButton.cssClass({ className })}
  {...$$restProps}
  let:builder
>
  <slot {builder}>
    <ChevronRight class={theme.ui.calendar.prevButton.ICON_CSS_CLASS} />
  </slot>
</CalendarPrimitive.NextButton>
