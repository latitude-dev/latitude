export const CHART_TYPES = {
  line: 'line',
  bar: 'bar',
  area: 'area',
  pie: 'pie',
  scatter: 'scatter',

  // TODO: Implement
  /* funnel = 'funnel', */
}

export type ChartType = keyof typeof CHART_TYPES

export enum AxisType {
  category = 'category',
  value = 'value',
  time = 'time',
  log = 'log',
}
