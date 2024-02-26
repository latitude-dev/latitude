<script lang='ts'>
  import Echart, { type Props as EchartProps } from './_Echarts.svelte'
  import { type CartesianChartProps, theme } from '@latitude-sdk/client'
  const generate = theme.ui.chart.generateBarConfig

  type $$Props = Omit<EchartProps, 'options'> & CartesianChartProps

  export let width: $$Props['width']
  export let height: $$Props['height']
  export let locale: $$Props['locale'] = 'en'
  export let isComputing: $$Props['isComputing'] = false
  export let dataset: $$Props['dataset']
  export let animation: $$Props['animation']
  export let x: $$Props['x']
  export let y: $$Props['y']
  export let yTitle: $$Props['yTitle']
  export let xTitle: $$Props['xTitle']
  export let swapAxis: $$Props['swapAxis'] = false
  export let xFormat: $$Props['xFormat']
  export let yFormat: $$Props['yFormat']
  export let config: $$Props['config']
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
