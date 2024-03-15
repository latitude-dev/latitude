<script context="module" lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import RangeCalendar from './index.svelte'
  import {
    DateFormatter,
    type DateValue,
    today,
    getLocalTimeZone
  } from "@internationalized/date";

  export const meta = {
    title: 'Range Calendar',
    component: RangeCalendar
  }
</script>

<script lang="ts">
  const df = new DateFormatter("en-US", { dateStyle: "long" });
  const localTimeZone = getLocalTimeZone();

  interface DateRange {
    start: DateValue;
    end: DateValue;
  }

  let value: DateRange = {
    start: today(localTimeZone),
    end: today(localTimeZone).add({ days: 2 })
  };

  function formatValue({ start, end }: DateRange): string {
    const startStr = start ? df.format(start.toDate(localTimeZone)) : "?";
    const endStr = end ? df.format(end.toDate(localTimeZone)) : "?";
    return `${startStr} - ${endStr}`;
  }

  let label = formatValue(value);

  function onValueChange(newValue?: DateRange): void {
    label = formatValue(newValue as { start: DateValue; end: DateValue })
  }
</script>

<Template let:args>
  <div class="flex flex-col justify-center gap-8">
    <div class="flex w-[250px] p-2 rounded-md text-primary-foreground bg-secondary-foreground">
      <div class="ml-4">{label}</div>
    </div>
    <RangeCalendar {value} {onValueChange} {...args} />
  </div>
</Template>

<Story name="Default" />