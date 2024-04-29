<script context="module" lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf'
  import DatePicker from './index.svelte'
  import { RichDate } from '@latitude-data/custom_types'
  import { derived, writable } from 'svelte/store'

  export const meta = {
    title: 'DatePicker',
    component: DatePicker
  }
</script>

<script lang="ts">
  const value = writable(new RichDate())
  const label = derived(value, $value => $value.toString())  

  function onChange(e: CustomEvent<RichDate>) {
    const newValue = e.detail
    if (newValue) value.set(newValue)
  }
</script>

<Template let:args>
  <div class="flex flex-col justify-center gap-8">
    <DatePicker value={$value} on:change={onChange} {...args} />
    <div class="flex w-[240px] p-2 rounded-md text-primary-foreground bg-secondary-foreground">
      <div class="ml-4">{$label}</div>
    </div>
  </div>
</Template>

<Story name="Default" />