<script context="module" lang="ts">
  import { Meta, Story, Template } from '@storybook/addon-svelte-csf'
  import Chart from './index.svelte'
  import { theme } from '@latitude-sdk/client'
  const gen = theme.ui.chart.generateCartesianConfig

  export const meta: Meta = {
    title: 'Chart',
    component: Chart,
    argTypes: {
    },
    parameters: {
      layout: 'centered',
      docs: {
        description: {
          component: "Chart base component"
        }
      }
    }
  }

  const FIELDS = [
    'event_month',
    'node_events_sum',
    'project_events_sum',
    'workspace_events_sum',
  ]
  const SOURCE = [
    ['2022-10', '11240', '3548', '200'],
    ['2022-11', '3437', '771', '60'],
    ['2022-12', '601', '323', '349'],
  ]

  const DEFAULT_CONFIG = {
    dataset: { fields: FIELDS, source: SOURCE },
    x: 'event_month',
    y: [
      { name: 'node_events_sum', chartType: 'bar' },
      { name: 'project_events_sum', chartType: 'bar' },
      { name: 'workspace_events_sum', chartType: 'bar' },
    ],
  }
</script>

<Template id='simple'>
  <Chart options={gen(DEFAULT_CONFIG)} />
</Template>
<Template id="axis">
  <Chart
    options={gen({
      ...DEFAULT_CONFIG,
      yTitle: 'Events by month',
      xTitle: 'Type of event',
    })}
  />
</Template>
<Template id="no_animation">
  <Chart
    options={gen({
      ...DEFAULT_CONFIG,
      animation: false,
    })}
  />
</Template>
<Template id="swapAxis">
  <Chart
    options={gen({
      ...DEFAULT_CONFIG,
      swapAxis: true,
    })}
  />
</Template>
<Template id="mixed">
  <Chart
    options={gen({
      ...DEFAULT_CONFIG,
      y: [
        { name: 'node_events_sum', chartType: 'line' },
        { name: 'project_events_sum', chartType: 'bar' },
        { name: 'workspace_events_sum', chartType: 'bar' },
      ],
    })}
  />
</Template>
<Template id="area">
  <Chart
    options={gen({
      ...DEFAULT_CONFIG,
      y: [{ name: 'node_events_sum', chartType: 'area' }],
    })}
  />
</Template>
<Template id="stackedBars">
  <Chart
    options={gen({
      ...DEFAULT_CONFIG,
      y: [
        { name: 'node_events_sum', chartType: 'bar' },
        { name: 'project_events_sum', chartType: 'bar' },
        { name: 'workspace_events_sum', chartType: 'bar' },
      ],
      yFormat: { stack: true }
    })}
  />
</Template>
<Template id="stacked100">
  <Chart
    options={gen({
      ...DEFAULT_CONFIG,
      y: [
        { name: 'node_events_sum', chartType: 'bar' },
        { name: 'project_events_sum', chartType: 'bar' },
        { name: 'workspace_events_sum', chartType: 'bar' },
      ],
      yFormat: { stack: 'normalized' }
    })}
  />
</Template>

<Story name="Simple" template='simple' />
<Story name="Axis title" template='axis' />
<Story name="No animation" template='no_animation' />
<Story name="Swap Axis" template='swapAxis' />
<Story name="Mixed charts" template='mixed' />
<Story name="Area" template='area' />
<Story name="Stacked Bars" template='stackedBars' />
<Story name="Stacked 100%" template='stacked100' />
