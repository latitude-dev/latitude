import { DBSource } from '../../../types'

import setLineChartStyle from './setLineChartStyles'
import setScatterStyle from './setScatterStyles'
import {
  ChartType,
  ConfigProps,
  EchartsCartesianSeriesOption,
  FullColumn,
} from '../types'

type Props<T extends ChartType> = {
  dimension: FullColumn
  serieColumn: string
  serieDisplayName: string | null
  chartType: T
  swapAxis: boolean
  fields: string[]
  axisIndex: number
  source: DBSource
  config: ConfigProps
}

export default function setSerie<T extends ChartType>({
  fields,
  serieColumn,
  serieDisplayName,
  chartType,
  swapAxis,
  axisIndex,
  dimension,
  source,
  config,
}: Props<T>) {
  const serieIndex = fields.findIndex((f) => f === serieColumn)
  const dimensionIndex = fields.findIndex((f) => f === dimension.name)
  const isArea = chartType === 'area'
  let serie: EchartsCartesianSeriesOption<ChartType> = {
    name: serieDisplayName || serieColumn,
    type: isArea ? 'line' : chartType,
    areaStyle: { opacity: isArea ? 0.4 : 0 },
    [swapAxis ? 'yAxisIndex' : 'xAxisIndex']: axisIndex,
    encode: swapAxis
      ? { y: dimensionIndex, x: serieIndex }
      : { x: dimensionIndex, y: serieIndex },
  }

  serie = setLineChartStyle({ serie, serieIndex, config })
  serie = setScatterStyle({
    serie,
    chartType,
    fields,
    source,
    config,
  })

  return {
    serie,
    serieIndexInSource: serieIndex,
  }
}
