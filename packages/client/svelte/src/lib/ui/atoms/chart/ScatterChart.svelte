<script context="module" lang='ts'>
  import Echart, { type Props as EchartProps } from './_Echarts.svelte'
  import { type ScatterChartProps } from '@latitude-sdk/client'
  export type Props = Omit<EchartProps, 'options'> & ScatterChartProps
</script>

<script lang='ts'>
  import { theme } from '@latitude-sdk/client'
  const generate = theme.ui.chart.generateScatterConfig

  export let dataset: Props['dataset']
  export let x: Props['x']
  export let y: Props['y']
  export let width: Props['width'] = undefined
  export let height: Props['height'] = undefined
  export let locale: Props['locale'] = 'en'
  export let isComputing: Props['isComputing'] = false
  export let animation: Props['animation'] = false
  export let sizeColumn: Props['sizeColumn']
  export let style: Props['style'] = 'circle'
  export let swapAxis: Props['swapAxis'] = false
  export let yTitle: Props['yTitle'] = ''
  export let xTitle: Props['xTitle'] = ''
  export let xFormat: Props['xFormat'] = undefined
  export let yFormat: Props['yFormat'] = undefined
  export let config: Props['config'] = {}
</script>

<Echart
  options={generate({
    dataset,
    animation,
    x,
    y,
    sizeColumn,
    style,
    yTitle,
    xTitle,
    swapAxis,
    xFormat,
    yFormat,
    config
  })}
  {width}
  {height}
  {locale}
  {isComputing}
/>
