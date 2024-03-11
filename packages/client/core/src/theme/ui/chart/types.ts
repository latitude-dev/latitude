export enum ChartLayerType {
  line = 'line',
  bar = 'bar',
  area = 'area',
  scatter = 'scatter',
  pie = 'pie',
  funnel = 'funnel',
}

export type DBSourceColumn = string | number
export type DBSourceRow = DBSourceColumn[]
export type DBSource = DBSourceRow[]
export type EChartsSupportedType =
  | ChartLayerType.line
  | ChartLayerType.bar
  | ChartLayerType.scatter
  | ChartLayerType.funnel
  | ChartLayerType.pie

export type Dataset = { fields: string[]; source: DBSource }

type OrdinalNumber = number
type OrdinalRawValue = string | number
type ParsedValueNumeric = number | OrdinalNumber
export type ScaleDataValue = ParsedValueNumeric | OrdinalRawValue | Date
