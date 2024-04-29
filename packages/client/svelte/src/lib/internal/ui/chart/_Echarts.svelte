<script context="module" lang="ts">
  import type { ECBasicOption } from 'echarts/types/dist/shared'
  type EchartsOptions = ECBasicOption
  type Locale = 'en' | 'es'

  export type Props = {
    options: EchartsOptions | null | undefined
    width?: number
    height?: number
    locale?: Locale
  }
</script>

<script lang="ts">
  import { debounce } from 'lodash-es'
  import * as echarts from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'

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

  import { themeConfig } from '$lib/ui/theme-wrapper/store'
  import { mode } from 'mode-watcher'
  import { derived } from 'svelte/store'

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
    locale: Locale | undefined
  }

  // TODO: Implement theming
  export let options: Props['options']
  export let width: Props['width'] = undefined
  export let height: Props['height'] = undefined
  export let locale: Props['locale'] = undefined

  const currentTheme = derived([themeConfig, mode], ([$themeConfig, $mode]) => {
    return ($mode === 'dark') ? $themeConfig.dark.echarts : $themeConfig.echarts
  });

  export function chartable(
    element: HTMLElement,
    { options, locale }: ChartableProps,
  ) {
    let resizeObserver: ResizeObserver
    let echartsInstance: echarts.EChartsType

    currentTheme.subscribe((newTheme) => {
      echarts.dispose(element)
      echartsInstance = echarts.init(element, newTheme, {
        renderer: 'canvas',
        locale: locale ?? 'en'
      })
      echartsInstance.setOption(options)
    })

    const onWindowResize = debounce(() => {
      echartsInstance.resize({
        animation: {
          duration: options.animation ? 400 : 0 }
      })
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
        echartsInstance.setOption({ ...options, ...newOptions }, { notMerge: true })
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

<div class="lat-h-full lat-w-full">
  {#if options}
    <div
      use:chartable={{ options, locale }}
      class="lat-min-h-full lat-min-w-full"
      style="width: {width}px; height: {height}px"
    />
  {/if}
</div>
