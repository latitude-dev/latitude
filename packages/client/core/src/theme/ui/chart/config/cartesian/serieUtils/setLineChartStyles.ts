import { ChartType, ConfigProps, EchartsCartesianSeriesOption } from '../types'

export const DEFAULT_LINE_LABEL_OPTIONS = {
  position: 'top',
  show: false,
}
type Props<T extends ChartType> = {
  serie: EchartsCartesianSeriesOption<T>
  serieIndex: number
  config: ConfigProps
}
export default function setLineChartStyle<T extends ChartType>({
  serie,
  serieIndex,
  config,
}: Props<T>): EchartsCartesianSeriesOption<T> {
  return {
    ...serie,
    showSymbol: !!config.showDots,
    connectNulls: true,
    label: {
      ...DEFAULT_LINE_LABEL_OPTIONS,
      formatter: `{@${serieIndex}}`,
      show: config.showValues,
    },
  }
}
