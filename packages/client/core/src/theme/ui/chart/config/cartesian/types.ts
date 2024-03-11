import type {
  EChartsOption,
  LineSeriesOption,
  BarSeriesOption,
  ScatterSeriesOption,
} from 'echarts'
import { AxisType } from '../types'

export const CHART_TYPES = {
  line: 'line',
  bar: 'bar',
  area: 'area',
  scatter: 'scatter',
}
export type ChartType = keyof typeof CHART_TYPES

export type Column = {
  name: string
  chartType?: ChartType
  displayName?: string | null
  axisIndex?: number
}
export type FullColumn = Column & {
  chartType: ChartType
  displayName: string | null
  axisIndex: number
}

export enum AxisAlign {
  start = 'start',
  end = 'end',
}

export type AxisOrientation = 'x' | 'y'

export type CommonAxisFormat = {
  type?: AxisType
  showAxis?: boolean
  rotate?: number
  displayName?: string | null
  showAxisTitle?: boolean
  showSplitLine?: boolean
  axisAlign?: AxisAlign
}

export type xAxisFormat = CommonAxisFormat
export type yAxisFormat = CommonAxisFormat & {
  stack: boolean | 'normalized'
}

export type xAxis = xAxisFormat | xAxisFormat[]
export type yAxis = yAxisFormat | yAxisFormat[]
export type ScatterStyle = 'circle' | 'emptyCircle'
type ScatterConfig = {
  column?: string
  style?: ScatterStyle
}
export type ConfigProps = {
  showDots?: boolean
  showValues?: boolean
  showZoom?: boolean
  showDecal?: boolean
  showLegend?: boolean
  scatterConfig?: ScatterConfig
  echartsConfig?: EChartsOption
}

export type EchartsCartesianSeriesOption<T extends ChartType> = T extends 'line'
  ? LineSeriesOption
  : T extends 'area'
    ? LineSeriesOption
    : T extends 'bar'
      ? BarSeriesOption
      : T extends 'scatter'
        ? ScatterSeriesOption
        : LineSeriesOption
