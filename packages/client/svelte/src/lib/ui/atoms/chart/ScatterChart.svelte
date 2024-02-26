<script lang='ts'>
  import Echart, { type Props as EchartProps } from './_Echarts.svelte'
  import { type ScatterChartProps, theme } from '@latitude-sdk/client'
  const generate = theme.ui.chart.generateScatterConfig

  type $$Props = Omit<EchartProps, 'options'> & ScatterChartProps

  export let width: $$Props['width']
  export let height: $$Props['height']
  export let locale: $$Props['locale'] = 'en'
  export let isComputing: $$Props['isComputing'] = false
  export let dataset: $$Props['dataset']
  export let animation: $$Props['animation']
  export let sizeColumn: $$Props['sizeColumn']
  export let style: $$Props['style'] = 'circle'
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
