import { useEffect, useRef } from 'react'
import { debounce } from 'lodash-es'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
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
import { ECBasicOption } from 'echarts/types/dist/shared'
import { useLatitudeTheme } from '$src'

type Locale = 'en' | 'es'

export type Props = {
  options: ECBasicOption | null | undefined
  width?: number
  height?: number
  locale?: Locale
}

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  FunnelChart,
  ScatterChart,
  GaugeChart,
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

export default function Echart({
  options,
  width,
  height,
  locale = 'en',
}: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const { currentTheme } = useLatitudeTheme()

  // Initialize the chart
  useEffect(() => {
    if (!chartRef.current) return
    chartInstance.current = echarts.init(
      chartRef.current,
      currentTheme.echarts,
      {
        renderer: 'canvas',
        locale,
      },
    )

    return () => {
      chartInstance.current?.dispose()
    }
  }, [currentTheme, locale])

  useEffect(() => {
    chartInstance.current?.resize()
  }, [height, width])

  // Update options when props change
  useEffect(() => {
    if (options) {
      chartInstance.current?.setOption(options, { notMerge: true })
    }
  }, [options])

  // Handle window resize
  useEffect(() => {
    const handleResize = debounce(() => {
      chartInstance.current?.resize({
        animation: {
          duration: options?.animation ? 400 : 0,
        },
      })
    }, 100)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [options])

  return (
    <div className='lat-h-full lat-w-full'>
      {options && (
        <div
          ref={chartRef}
          className='lat-min-h-full lat-min-w-full'
          style={{
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : '100%',
          }}
        />
      )}
    </div>
  )
}
