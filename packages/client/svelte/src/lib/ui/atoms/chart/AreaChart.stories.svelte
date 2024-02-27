<script context="module" lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import AreaChart from './AreaChart.svelte'
  import { DATASET } from './__mock__/data'

  export const meta: Meta = {
    title: 'Charts/AreaChart',
    component: AreaChart,
    argTypes: {
      yTitle: { control: 'text' },
      xTitle: { control: 'text' },
      swapAxis: { control: 'boolean' },
      stack: { control: 'boolean' },
      'config.showDots': { control: 'boolean' },
      'config.showValues': { control: 'boolean' },
      'config.showLegend': { control: 'boolean' },
    },
    args: {
      yTitle: 'Events by month',
      xTitle: 'Type of event',
      swapAxis: false,
      stack: false,
      'config.showDots': true,
      'config.showValues': true,
      'config.showLegend': false,
    },
    parameters: { layout: 'centered' }
  }
</script>

<Template id='line' let:args>
  <AreaChart
    dataset={DATASET}
    x='event_month'
    y={['node_events_sum', 'project_events_sum', 'workspace_events_sum']}
    yFormat={{ stack: args.stack }}
    xTitle={args.xTitle}
    yTitle={args.yTitle}
    swapAxis={args.swapAxis}
    config={{
      showDots: args.config.showDots,
      showValues: args.config.showValues,
      showLegend: args.config.showLegend,
    }}
  />
</Template>

<Story name="Basic" template='line' />
