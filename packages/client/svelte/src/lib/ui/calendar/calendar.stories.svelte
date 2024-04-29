<script context="module" lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import Calendar from './index.svelte'
  import {
    DateFormatter,
    type DateValue,
    today,
    getLocalTimeZone
  } from "@internationalized/date";

  export const meta = {
    title: 'Calendar',
    component: Calendar
  }
</script>

<script lang="ts">
  const df = new DateFormatter("en-US", { dateStyle: "long" });
  const localTimeZone = getLocalTimeZone();

  let value = today(localTimeZone);
  let label: string = df.format(value.toDate(localTimeZone));

  function onValueChange(newValue?: DateValue): void {
    label = newValue
      ? df.format(newValue.toDate(localTimeZone))
      : "No date selected";
  }
</script>

<Template let:args>
  <div class="lat-flex lat-flex-col lat-justify-center lat-gap-8">
    <div class="lat-flex lat-w-[250px] p-2 lat-rounded-md lat-text-primary-foreground lat-bg-secondary-foreground">
      <div class="lat-ml-4">{label}</div>
    </div>
    <Calendar bind:value {onValueChange} {...args} />
  </div>
</Template>

<Story name="Default" />