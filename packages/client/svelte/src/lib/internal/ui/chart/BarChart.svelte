<script context="module" lang="ts">
  import { type Props as EchartProps } from './_Echarts.svelte'
  import { type CartesianChartProps } from '@latitude-data/client'
  import Wrapper, { type WrapperProps } from './_Wrapper.svelte'

  export type BarChartProps = Omit<EchartProps, 'options' | 'isComputing'> &
    Omit<CartesianChartProps, 'dataset'> &
    WrapperProps
</script>

<script lang="ts">
  import Echart from './_Echarts.svelte'
  import { theme } from '@latitude-data/client'
  const generate = theme.ui.chart.generateBarConfig

  type $$Props = BarChartProps
  export let data: $$Props['data'] = null
  export let isLoading: $$Props['isLoading'] = false
  export let error: $$Props['error'] = null

  export let x: $$Props['x']
  export let y: $$Props['y']
  export let sort: $$Props['sort'] = undefined
  export let title: $$Props['title'] = undefined
  export let description: $$Props['description'] = undefined
  export let bordered: $$Props['bordered'] = false
  export let width: $$Props['width'] = undefined
  export let height: $$Props['height'] = undefined
  export let locale: $$Props['locale'] = 'en'
  export let animation: $$Props['animation'] = true
  export let yTitle: $$Props['yTitle'] = ''
  export let xTitle: $$Props['xTitle'] = ''
  export let swapAxis: $$Props['swapAxis'] = false
  export let xFormat: $$Props['xFormat'] = undefined
  export let yFormat: $$Props['yFormat'] = undefined
  export let config: $$Props['config'] = undefined
  export let download: $$Props['download'] = undefined
</script>

<Wrapper
  {download}
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
