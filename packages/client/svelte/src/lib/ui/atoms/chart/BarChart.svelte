<script context='module' lang='ts'>
  import { type Props as EchartProps } from './_Echarts.svelte'
  import { type CartesianChartProps } from '@latitude-sdk/client'

  export type Props = Omit<EchartProps, 'options'> & CartesianChartProps
</script>

<script lang='ts'>
  import Echart from './_Echarts.svelte'
  import { theme } from '@latitude-sdk/client'
  const generate = theme.ui.chart.generateBarConfig

  export let dataset: Props['dataset']
  export let x: Props['x']
  export let y: Props['y']
  export let width: Props['width'] = undefined
  export let height: Props['height'] = undefined
  export let locale: Props['locale'] = 'en'
  export let isComputing: Props['isComputing'] = false
  export let animation: Props['animation'] = false
  export let yTitle: Props['yTitle'] = ''
  export let xTitle: Props['xTitle'] = ''
  export let swapAxis: Props['swapAxis'] = false
  export let xFormat: Props['xFormat'] = undefined
  export let yFormat: Props['yFormat'] = undefined
  export let config: Props['config'] = undefined
</script>

<Echart
  options={generate({
    dataset,
    animation,
    x,
    y,
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
