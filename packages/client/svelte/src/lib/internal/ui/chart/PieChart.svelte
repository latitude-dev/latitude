<script context="module" lang="ts">
  import { type PieChartProps as CorePieChartProps } from '@latitude-data/client'
  import { type Props as EchartProps } from './_Echarts.svelte'
  import { type WrapperProps } from './_Wrapper.svelte'

  export type PieChartProps = Omit<EchartProps, 'isComputing' | 'options'> &
    Omit<CorePieChartProps, 'dataset'> &
    WrapperProps
</script>

<script lang="ts">
  import Wrapper from './_Wrapper.svelte'
  import Echart from './_Echarts.svelte'
  import { theme } from '@latitude-data/client'
  const generatePieConfig = theme.ui.chart.generatePieConfig

  type $$Props = PieChartProps
  export let data: $$Props['data'] = null
  export let sort: $$Props['sort'] = undefined
  export let isLoading: $$Props['isLoading'] = false
  export let error: $$Props['error'] = null

  export let title: $$Props['title'] = undefined
  export let description: $$Props['description'] = undefined
  export let bordered: $$Props['bordered'] = false
  export let displayName: $$Props['displayName'] = undefined
  export let width: $$Props['width'] = undefined
  export let height: $$Props['height'] = undefined
  export let locale: $$Props['locale'] = 'en'
  export let animation: $$Props['animation'] = true
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
    options={generatePieConfig({
      dataset,
      sort,
      displayName,
      animation,
      config,
    })}
    {width}
    {locale}
  />
</Wrapper>
