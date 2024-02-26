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

  type EchartsOptions = ECBasicOption
  type EchartsTheme = object
  export type Props = {
    options: EchartsOptions
    width: number
    height: number
    theme?: EchartsTheme
    isComputing?: boolean
    locale?: string
  }

  type ChartableProps = {
    options: EchartsOptions
    theme: EchartsTheme
    locale: 'en' | 'es'
  }

  type $$Props = Props;

  // PROPS
  export let options: $$Props['options']

  // DO chart theming
  export let theme: $$Props['theme'] = client.ui.chart.THEMES.latitude
  export let width: $$Props['width']
  export let height: $$Props['height']
  export let locale: $$Props['locale'] = 'en'
  export let isComputing: $$Props['isComputing'] = false

  export function chartable(
    element: HTMLElement,
    { options, theme, locale }: ChartableProps
  ) {
    let resizeObserver;
    const echartsInstance = echarts.init(
      element, theme, { renderer: 'canvas', locale }
    )
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
  <div
    use:chartable={{ theme, options, locale }}
    class="min-w-full min-h-full"
    style="width: {width}px; height: {height}px"
  />
</div>
