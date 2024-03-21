<script context="module" lang="ts">
  import Echart, { type Props as EchartProps } from './_Echarts.svelte'
  import { type ScatterChartProps as ClientScatterChartProps } from '@latitude-data/client'
  import type { WrapperProps } from './_Wrapper.svelte'

  export type ScatterChartProps = Omit<EchartProps, 'options'> &
    Omit<ClientScatterChartProps, 'dataset'> &
    WrapperProps
</script>

<script lang="ts">
  import { theme } from '@latitude-data/client'
  import Wrapper from './_Wrapper.svelte'
  const generate = theme.ui.chart.generateScatterConfig

  type $$Props = ScatterChartProps
  export let data: $$Props['data'] = null
  export let isLoading: $$Props['isLoading'] = false
  export let error: $$Props['error'] = null

  export let title: $$Props['title'] = undefined
  export let description: $$Props['description'] = undefined
  export let bordered: $$Props['bordered'] = false
  export let x: $$Props['x']
  export let y: $$Props['y']
  export let width: $$Props['width'] = undefined
  export let height: $$Props['height'] = undefined
  export let locale: $$Props['locale'] = 'en'
  export let animation: $$Props['animation'] = true
  export let sizeColumn: $$Props['sizeColumn']
  export let style: $$Props['style'] = 'circle'
  export let swapAxis: $$Props['swapAxis'] = false
  export let yTitle: $$Props['yTitle'] = ''
  export let xTitle: $$Props['xTitle'] = ''
  export let xFormat: $$Props['xFormat'] = undefined
  export let yFormat: $$Props['yFormat'] = undefined
  export let config: $$Props['config'] = {}
</script>

<Wrapper
  {data}
  {title}
  {description}
  {bordered}
  {isLoading}
  {error}
  {width}
  {height}
  let:dataset
  let:contentHeight
>
  <Echart
    height={contentHeight}
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
      config,
    })}
    {width}
    {locale}
  />
</Wrapper>
