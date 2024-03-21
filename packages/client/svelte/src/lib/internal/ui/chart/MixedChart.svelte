<script context="module" lang="ts">
  import { type Props as EchartProps } from './_Echarts.svelte'
  import { type CartesianChartProps, theme } from '@latitude-data/client'
  import Wrapper, { type WrapperProps } from './_Wrapper.svelte'

  export type MixedChartProps = Omit<EchartProps, 'options' | 'isComputing'> &
    Omit<CartesianChartProps, 'dataset'> &
    WrapperProps
</script>

<script lang="ts">
  import Echart from './_Echarts.svelte'
  const generate = theme.ui.chart.generateCartesianConfig

  export let data: MixedChartProps['data'] = null
  export let isLoading: MixedChartProps['isLoading'] = false
  export let error: MixedChartProps['error'] = null

  type $$Props = MixedChartProps
  export let x: $$Props['x']
  export let y: $$Props['y']
  export let title: $$Props['title'] = undefined
  export let description: $$Props['description'] = undefined
  export let bordered: $$Props['bordered'] = false
  export let sort: $$Props['sort'] = undefined
  export let width: $$Props['width'] = undefined
  export let height: $$Props['height'] = undefined
  export let locale: $$Props['locale'] = 'en'
  export let animation: $$Props['animation'] = true
  export let swapAxis: $$Props['swapAxis'] = false
  export let yTitle: $$Props['yTitle'] = ''
  export let xTitle: $$Props['xTitle'] = ''
  export let xFormat: $$Props['xFormat'] = undefined
  export let yFormat: $$Props['yFormat'] = undefined
  export let config: $$Props['config'] = undefined
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
      sort,
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
