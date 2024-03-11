import { EChartsOption } from 'echarts'
import { isNaN } from 'lodash-es'
import { DBSource, DBSourceRow, Dataset } from '../../types'
import { Sort, getDataset } from '../common/getDataset'
import setLegend from '../common/setLegend'
import { COLORS, FONT } from '../common/designTokens'

const OVERFLOW_TEXT_WIDTH = 200
const DEFAULT_LABEL_INDEX = 0
const DEFAULT_VALUE_INDEX = 1
function sumValues(values: DBSource, valuesIndex: number): number {
  return values.reduce((sum: number, row: DBSourceRow) => {
    const value = row?.[valuesIndex]

    if (value === undefined) return sum
    if (isNaN(Number(value))) return sum

    sum = sum + Number(value)
    return sum
  }, 0)
}

type ConfigProps = {
  showDecal?: boolean
  showLegend?: boolean
  showTotalValue?: boolean
  showHole?: boolean
  showLabels?: boolean
}
const CONIFG_DEFAULTS: ConfigProps = {
  showLabels: true,
  showTotalValue: true,
  showDecal: false,
  showLegend: false,
  showHole: false,
}

export type PieChartProps = {
  dataset: Dataset
  sort?: Sort
  displayName?: string
  animation?: boolean
  config?: ConfigProps
}
export default function generatePieConfig({
  dataset,
  sort,
  displayName,
  animation = true,
  config: {
    showLabels = true,
    showTotalValue = true,
    showDecal = false,
    showLegend = false,
    showHole = false,
  } = CONIFG_DEFAULTS,
}: PieChartProps): EChartsOption {
  const { datasets, datasetIndex } = getDataset({ dataset, sort })
  const legend = setLegend({ show: showLegend })
  const totalValues = sumValues(dataset.source, DEFAULT_VALUE_INDEX)
  return {
    animation,
    dataset: datasets,
    title: {
      show: showTotalValue && showHole,
      left: 'center',
      top: 'center',
      textVerticalAlign: 'top',
      text: String(
        Number.isInteger(totalValues) ? totalValues : totalValues.toFixed(2)
      ),
      textStyle: {
        fontFamily: FONT.fontFamily.sans,
        fontSize: FONT.sizes.h3.fontSize,
        fontWeight: FONT.sizes.h3.fontWeight,
        lineHeight: FONT.sizes.h3.lineHeight,
        color: COLORS.gray1000,
        width: OVERFLOW_TEXT_WIDTH,
      },
      itemGap: 0,
      padding: 0,
      subtext: displayName,
      subtextStyle: {
        fontFamily: FONT.fontFamily.sans,
        fontSize: FONT.sizes.h5.fontSize,
        fontWeight: FONT.sizes.h5.fontWeight,
        lineHeight: FONT.sizes.h5.lineHeight,
        color: COLORS.gray1000,
        overflow: 'truncate',
        width: OVERFLOW_TEXT_WIDTH,
      },
    },
    series: [
      {
        type: 'pie',
        radius: [showHole ? '40%' : 0, '70%'],
        itemStyle: { borderRadius: 0, borderColor: 'white', borderWidth: 2 },
        minShowLabelAngle: 8,
        label: {
          show: showLabels,
          minMargin: 5,
          edgeDistance: 10,
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
        labelLine: {
          show: true,
          length: 4,
          length2: 1,
          maxSurfaceAngle: 100,
        },
        encode: {
          value: DEFAULT_VALUE_INDEX,
          itemName: DEFAULT_LABEL_INDEX,
        },
        datasetIndex
      },
    ],
    aria: { enabled: showDecal, decal: { show: showDecal } },
    tooltip: { trigger: 'item' },
    legend,
  }
}
