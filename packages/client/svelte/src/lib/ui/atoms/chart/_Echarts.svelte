<script context="module" lang="ts">
  type EchartsOptions = ECBasicOption
  type Locale = 'en' | 'es'
  type EchartsTheme = object

  export type Props = {
    options: EchartsOptions | null | undefined
    width?: number
    height?: number
    isComputing?: boolean
    locale?: Locale
  }
</script>

<script lang="ts">
  import debounce from 'lodash/debounce'
  import * as echarts from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import type { ECBasicOption } from 'echarts/types/dist/shared'

  // Core components
  import {
    GridComponent,
    TooltipComponent,
    TitleComponent,
    LegendComponent,
    DatasetComponent,
    TransformComponent,
    DataZoomComponent,
    AriaComponent,
  } from 'echarts/components'

  import {
    LineChart,
    BarChart,
    ScatterChart,
    PieChart,
    FunnelChart,
    GaugeChart,
  } from 'echarts/charts'

  import { theme as client } from '@latitude-sdk/client'
  const { cn } = client.utils

  echarts.use([
    // Charts
    LineChart,
    BarChart,
    PieChart,
    FunnelChart,
    ScatterChart,
    GaugeChart,

    // Core components
    AriaComponent,
    TitleComponent,
    LegendComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    DataZoomComponent,

    CanvasRenderer,
  ])

  type ChartableProps = {
    options: EchartsOptions
    theme: EchartsTheme
    locale: Locale | undefined
  }

  // TODO: Implement theming
  const theme = client.ui.chart.THEMES.latitude
  export let options: Props['options']
  export let width: Props['width'] = undefined
  export let height: Props['height'] = undefined
  export let locale: Props['locale'] = undefined
  export let isComputing: Props['isComputing'] = false

  export function chartable(
    element: HTMLElement,
    { options, theme, locale }: ChartableProps,
  ) {
    console.log('FIRST_RENDER_HOLA', options)

    let resizeObserver: ResizeObserver
    const echartsInstance = echarts.init(element, theme, {
      renderer: 'canvas',
      locale: locale ?? 'en',
    })
    echartsInstance.setOption(options)

    const onWindowResize = debounce(() => {
      echartsInstance.resize({ animation: { duration: 400 } })
    }, 100)

    if (window.ResizeObserver && element) {
      resizeObserver = new ResizeObserver(onWindowResize)
      resizeObserver.observe(element)
    } else {
      window.addEventListener('resize', onWindowResize)
    }

    onWindowResize()
    return {
      update({ options: newOptions }: ChartableProps) {
        console.log('UPDATE_CALLBACK_HOLA', newOptions)
        echartsInstance.setOption({ ...options, ...newOptions })
      },
      destroy() {
        if (resizeObserver) {
          resizeObserver.unobserve(element)
        } else {
          window.removeEventListener('resize', onWindowResize)
        }
        echartsInstance.dispose()
      },
    }
  }
</script>

<div class={cn('h-full w-full', { 'animate-pulse': isComputing })}>
  {#if options}
    <div
      use:chartable={{ theme, options, locale }}
      class="min-h-full min-w-full"
      style="width: {width}px; height: {height}px"
    />
  {/if}
</div>
