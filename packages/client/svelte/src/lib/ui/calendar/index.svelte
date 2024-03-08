<script lang="ts">
  import { Calendar as CalendarPrimitive } from "bits-ui";
  import { theme } from "@latitude-data/client"
  import Header from "./calendar-header.svelte";
  import PrevButton from "./calendar-prev-button.svelte";
  import Heading from "./calendar-heading.svelte";
  import NextButton from "./calendar-next-button.svelte";
  import Months from "./calendar-months.svelte";
  import Grid from "./calendar-grid.svelte";
  import GridHead from "./calendar-grid-head.svelte";
  import GridRow from "./calendar-grid-row.svelte";
  import HeadCell from "./calendar-head-cell.svelte";
  import GridBody from "./calendar-grid-body.svelte";
  import Cell from "./calendar-cell.svelte";
  import Day from "./calendar-day.svelte";
  
  type $$Props = CalendarPrimitive.Props;

  export let value: $$Props["value"] = undefined;
  export let placeholder: $$Props["placeholder"] = undefined;
  export let weekdayFormat: $$Props["weekdayFormat"] = "short";

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<CalendarPrimitive.Root
  bind:value
  bind:placeholder
  {weekdayFormat}
  class={theme.ui.calendar.cssClass({ className })}
  {...$$restProps}
  on:keydown
  on:input
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
          <GridRow class="flex">
            {#each weekdays as weekday}
              <HeadCell>
                {weekday.slice(0, 2)}
              </HeadCell>
            {/each}
          </GridRow>
        </GridHead>
        <GridBody>
          {#each month.weeks as weekDates}
            <GridRow class="mt-2 w-full">
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
</CalendarPrimitive.Root>
