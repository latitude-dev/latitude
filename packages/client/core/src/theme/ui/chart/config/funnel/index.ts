import type { EChartsOption } from 'echarts'
import { DBSource, Dataset } from '../../types'
import { getDataset } from '../common/getDataset'
import setLegend from '../common/setLegend'
import { COLORS, FONT } from '../common/designTokens'
import { AnimationEasing } from '../cartesian'
import { defaultTheme } from '../../../../skins'

const valuesRange = (values: number[]): number[] => {
  return values.reduce(
    (range: number[], value) => {
      if (isNaN(value)) return range

      const minRange = range[0]
      const maxRange = range[1]
      if (!minRange || !maxRange) return range

      range[0] = Math.min(minRange, value)
      range[1] = Math.max(maxRange, value)

      return range
    },
    [Infinity, -Infinity],
  )
}

type FunnelDirection = 'ascending' | 'descending'
type FunnelOrientation = 'vertical' | 'horizontal'

const getColoredData = ({
  data,
  valuesIndex,
  sort = 'descending',
  visualMapColor,
}: {
  data: DBSource
  valuesIndex: number
  sort: FunnelDirection
  visualMapColor: string[]
}) => {
  const colorRange = visualMapColor.length - 1

  const sortedData = data.sort((a, b) => {
    const aValue = a[valuesIndex]
    const bValue = b[valuesIndex]

    if (!aValue || !bValue) return 0
    if (isNaN(+aValue) || isNaN(+bValue)) return 0

    return sort === 'ascending' ? +bValue - +aValue : +aValue - +bValue
  })

  const [start, end] = valuesRange(
    data.map((row) => {
      const rowVal = row[valuesIndex]
      if (!rowVal) return 0

      return +rowVal
    }),
  )

  return sortedData.map((row) => {
    const value = row[1] ? +row[1] : 0
    const startValue = start ? +start : 0
    const endValue = end ? +end : 0
    return {
      name: row[0],
      value,
      itemStyle: {
        color:
          visualMapColor[
            Math.round(
              ((value - startValue) / (endValue - startValue)) * colorRange,
            )
          ],
      },
    }
  })
}

export type FunnelChartProps = {
  dataset: Dataset
  sort?: FunnelDirection
  orientation?: FunnelOrientation
  showColorGradient?: boolean
  showDecal?: boolean
  showLegend?: boolean
  showLabels?: boolean
  animation?: boolean
  animationEasing?: AnimationEasing
  animationEasingUpdate?: AnimationEasing
  visualMapColor?: string[]
}

export default function generateFunnelConfig({
  dataset,
  animation = true,
  animationEasing = 'cubicInOut',
  animationEasingUpdate = 'cubicInOut',
  sort = 'descending',
  orientation = 'vertical',
  showColorGradient = false,
  showLabels = true,
  showDecal = false,
  showLegend = false,
  visualMapColor = defaultTheme.echarts.visualMapColor as string[],
}: FunnelChartProps): EChartsOption {
  const { datasets } = getDataset({ dataset })
  const legend = setLegend({ show: showLegend })
  const data = showColorGradient
    ? getColoredData({
        visualMapColor,
        data: dataset.source,
        valuesIndex: 1,
        sort,
      })
    : undefined

  return {
    animation,
    animationEasing,
    animationEasingUpdate,
    dataset: datasets,
    title: { show: false },
    series: [
      {
        type: 'funnel',
        data,
        sort,
        orient: orientation,
        funnelAlign: 'center',
        left: 0,
        width: '100%',
        top: showLegend ? 30 : 0,
        bottom: 0,
        gap: 0,

        label: {
          show: showLabels,
          position: 'inside',
          minMargin: 5,
          distance: 10,
          lineHeight: FONT.sizes.h6.lineHeight,
          formatter: '{b}\n{formattedValue|{@1}}',
          rich: {
            formattedValue: {
              fontSize: FONT.sizes.h6.fontSize,
              fontWeight: FONT.sizes.h6.fontWeight,
              lineHeight: FONT.sizes.h6.lineHeight,
              color: COLORS.gray800,
            },
          },
        },

        itemStyle: {
          borderColor: 'white',
          borderWidth: 4,
        },

        emphasis: {
          // when hovered
          label: {
            fontSize: FONT.sizes.h5.fontSize,
          },
          itemStyle: {
            borderWidth: 0,
          },
        },
      },
    ],
    aria: { enabled: showDecal, decal: { show: showDecal } },
    tooltip: { trigger: 'item' },
    legend,
  }
}
