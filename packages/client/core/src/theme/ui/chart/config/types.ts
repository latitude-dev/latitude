export const CARTESIAN_CHART_TYPES = {
  line: 'line',
  bar: 'bar',
  area: 'area',
  scatter: 'scatter',
}
export const CHART_TYPES = {
  ...CARTESIAN_CHART_TYPES,
  pie: 'pie',
}

export type CartesianChartType = keyof typeof CARTESIAN_CHART_TYPES
export type ChartType = keyof typeof CHART_TYPES

export enum AxisType {
  category = 'category',
  value = 'value',
  time = 'time',
  log = 'log',
}
