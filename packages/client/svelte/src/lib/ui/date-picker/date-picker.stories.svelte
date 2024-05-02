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
  <div class="lat-flex lat-flex-col lat-justify-center lat-gap-8">
    <DatePicker value={$value} on:change={onChange} {...args} />
    <div class="lat-flex lat-w-[240px] lat-p-2 lat-rounded-md lat-text-primary-foreground lat-bg-secondary-foreground">
      <div class="lat-ml-4">{$label}</div>
    </div>
  </div>
</Template>

<Story name="Default" />