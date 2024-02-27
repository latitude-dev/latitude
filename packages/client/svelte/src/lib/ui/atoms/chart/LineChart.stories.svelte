<script context="module" lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import LineChart from './LineChart.svelte'
  import { DATASET } from './__mock__/data'

  export const meta: Meta = {
    title: 'Charts/LineChart',
    component: LineChart,
    argTypes: {
      yTitle: { control: 'text' },
      xTitle: { control: 'text' },
      swapAxis: { control: 'boolean' },
      'config.showValues': { control: 'boolean' },
      'config.showLegend': { control: 'boolean' },
      'config.showDecal': { control: 'boolean' },
    },
    args: {
      yTitle: 'Events by month',
      xTitle: 'Type of event',
      swapAxis: false,
      'config.showValues': false,
      'config.showLegend': false,
      'config.showDecal': false,
    },
    parameters: { layout: 'centered' }
  }
</script>

<Template id='line' let:args>
  <LineChart
    dataset={DATASET}
    x='event_month'
    y={['node_events_sum', 'project_events_sum', 'workspace_events_sum']}
    xTitle={args.xTitle}
    yTitle={args.yTitle}
    swapAxis={args.swapAxis}
    config={{
      showValues: args.config.showValues,
      showLegend: args.config.showLegend,
      showDecal: args.config.showDecal,
    }}
  />
</Template>

<Story name="Basic" template='line' />

