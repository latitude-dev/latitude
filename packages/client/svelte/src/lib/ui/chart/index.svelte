<script lang="ts">
  import debounce from 'lodash/debounce'
  import * as echarts from 'echarts/core'
  import { CanvasRenderer } from 'echarts/renderers'
  import { theme as client } from '@latitude-sdk/client'

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

  import type { ChartableProps} from "./types";

  // PROPS
  export let options: $$Props['options']
  export let theme: $$Props['theme'] = client.ui.chart.THEMES.latitude
  export let width: $$Props['width']
  export let height: $$Props['height']
  export let isComputing: $$Props['isComputing'] = false

  export function chartable(
    element: HTMLElement,
    { options, theme}: ChartableProps
  ) {
    let resizeObserver;
    const echartsInstance = echarts.init(
      element, theme, { renderer: 'canvas' }
    )
    echartsInstance.setOption(options)

    const onWindowResize = debounce(() => {
      echartsInstance.resize({ animation: { duration: 400, } })
    }, 100)

    if (window.ResizeObserver && element) {
      resizeObserver = new ResizeObserver(onWindowResize);
      resizeObserver.observe(element);
    } else {
      window.addEventListener('resize', onWindowResize);
    }

    onWindowResize()
    return {
      update({ options: newOptions }: ChartableProps) {
        echartsInstance.setOption({ ...options, ...newOptions })
      },
      destroy() {
        if (resizeObserver) {
          resizeObserver.unobserve(element);
        } else {
          window.removeEventListener('resize', onWindowResize);
        }
        echartsInstance.dispose()
      },
    }
  }
  import { type Props  } from "./types";
  type $$Props = Props;
  const { cn } = client.utils
</script>

<div class={cn('w-full h-full', { 'animate-pulse': isComputing })}>
  <div
    use:chartable={{ theme, options }}
    class="min-w-full min-h-full"
    style="width: {width}px; height: {height}px"
  />
</div>
