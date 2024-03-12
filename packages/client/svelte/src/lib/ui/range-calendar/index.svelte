<script lang="ts">
  import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";
  import Cell from "./range-calendar-cell.svelte";
  import Day from "./range-calendar-day.svelte";
  import Grid from "./range-calendar-grid.svelte";
  import Header from "./range-calendar-header.svelte";
  import Months from "./range-calendar-months.svelte";
  import GridRow from "./range-calendar-grid-row.svelte";
  import Heading from "./range-calendar-heading.svelte";
  import GridBody from "./range-calendar-grid-body.svelte";
  import GridHead from "./range-calendar-grid-head.svelte";
  import HeadCell from "./range-calendar-head-cell.svelte";
  import NextButton from "./range-calendar-next-button.svelte";
  import PrevButton from "./range-calendar-prev-button.svelte";
  import { theme } from "@latitude-data/client"

  type $$Props = RangeCalendarPrimitive.Props;

  export let value: $$Props["value"] = undefined;
  export let placeholder: $$Props["placeholder"] = undefined;
  export let weekdayFormat: $$Props["weekdayFormat"] = "short";
  export let startValue: $$Props["startValue"] = undefined;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<RangeCalendarPrimitive.Root
  bind:value
  bind:placeholder
  bind:startValue
  {weekdayFormat}
  class={theme.ui.calendar.cssClass({ className })}
  {...$$restProps}
  on:keydown
  let:months
  let:weekdays
>
  <Header>
    <PrevButton />
    <Heading />
    <NextButton />
  </Header>
  <Months>
    {#each months as month}
      <Grid>
        <GridHead>
          <GridRow class={theme.ui.calendar.HEADER_ROW_CSS_CLASS}>
            {#each weekdays as weekday}
              <HeadCell>
                {weekday.slice(0, 2)}
              </HeadCell>
            {/each}
          </GridRow>
        </GridHead>
        <GridBody>
          {#each month.weeks as weekDates}
            <GridRow class={theme.ui.calendar.BODY_ROW_CSS_CLASS}>
              {#each weekDates as date}
                <Cell {date}>
                  <Day {date} month={month.value} />
                </Cell>
              {/each}
            </GridRow>
          {/each}
        </GridBody>
      </Grid>
    {/each}
  </Months>
</RangeCalendarPrimitive.Root>
