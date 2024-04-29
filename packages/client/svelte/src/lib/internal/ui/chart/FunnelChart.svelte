<script context="module" lang="ts">
  import { type Props as EchartProps } from './_Echarts.svelte'
  import { type FunnelChartProps as ClientFunnelChartProps } from '@latitude-data/client'
  import Wrapper, { type WrapperProps } from './_Wrapper.svelte'

  export type FunnelChartProps = Omit<EchartProps, 'options'> &
    Omit<ClientFunnelChartProps, 'dataset'> &
    WrapperProps
</script>

<script lang="ts">
  import Echart from './_Echarts.svelte'
  import { theme } from '@latitude-data/client'
  import { themeConfig } from '$lib/ui/theme-wrapper/store'
  import { mode } from 'mode-watcher'
  import { derived } from 'svelte/store'
  const generate = theme.ui.chart.generateFunnelConfig
  const visualMapColor = derived([themeConfig, mode], ([$themeConfig, $mode]) => {
    return ($mode === 'dark' ? $themeConfig.dark.echarts.visualMapColor : $themeConfig.echarts.visualMapColor) as string[]
  });

  type $$Props = FunnelChartProps
  export let data: $$Props['data'] = null
  export let isLoading: $$Props['isLoading'] = false
  export let error: $$Props['error'] = null

  export let title: $$Props['title'] = undefined
  export let description: $$Props['description'] = undefined
  export let bordered: $$Props['bordered'] = false
  export let width: $$Props['width'] = undefined
  export let height: $$Props['height'] = undefined
  export let locale: $$Props['locale'] = 'en'
  export let animation: $$Props['animation'] = true
  export let sort: $$Props['sort'] = 'descending'
  export let orientation: $$Props['orientation'] = 'vertical'
  export let showColorGradient: $$Props['showColorGradient'] = false
  export let showLabels: $$Props['showLabels'] = true
  export let showDecal: $$Props['showDecal'] = false
  export let showLegend: $$Props['showLegend'] = false
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
      sort,
      orientation,
      showColorGradient,
      showLabels,
      showDecal,
      showLegend,
      visualMapColor: $visualMapColor,
    })}
    {width}
    {locale}
  />
</Wrapper>
