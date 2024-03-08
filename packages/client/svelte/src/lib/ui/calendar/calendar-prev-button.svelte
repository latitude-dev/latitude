<script lang="ts">
  import { Calendar as CalendarPrimitive } from "bits-ui";
  import { ChevronLeft } from "radix-icons-svelte";
  import { theme } from "@latitude-data/client"

  type $$Props = CalendarPrimitive.PrevButtonProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<CalendarPrimitive.PrevButton
  on:click
  class={theme.ui.calendar.prevButton.cssClass({ className })}
  {...$$restProps}
  let:builder
>
  <slot {builder}>
    <ChevronLeft class={theme.ui.calendar.prevButton.ICON_CSS_CLASS} />
  </slot>
</CalendarPrimitive.PrevButton>
