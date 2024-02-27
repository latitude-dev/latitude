import { DBSource, DBSourceRow } from '../../../types'
import { EchartsCartesianSeriesOption, ChartType, ConfigProps } from '../types'

const MAX_BUBBLE_SIZE = 40

type Props<T extends ChartType> = {
  serie: EchartsCartesianSeriesOption<T>
  chartType: ChartType
  fields: string[]
  source: DBSource
  config: ConfigProps
}

export default function setScatterStyle<T extends ChartType>({
  serie,
  chartType,
  fields,
  source,
  config,
}: Props<T>): EchartsCartesianSeriesOption<T> {
  const column = config.scatterConfig?.column
  const style = config.scatterConfig?.style

  if (chartType !== 'scatter' && !column) return serie

  const columnIndex = fields.findIndex((f) => f === column)
  let symbolSize = (_d: DBSourceRow) => MAX_BUBBLE_SIZE / 2

  if (columnIndex !== -1) {
    const maxValueSource = Math.max(
      ...source.map((row) => Number(row[columnIndex])),
    )
    symbolSize = (data: DBSourceRow) => {
      if (isNaN(maxValueSource)) return MAX_BUBBLE_SIZE / 2

      return (
        (parseFloat(String(data[columnIndex])) / maxValueSource) *
        MAX_BUBBLE_SIZE
      )
    }
  }

  return {
    ...serie,
    symbol: style,
    symbolSize,
  }
}
