import type {
  EChartsOption,
  XAXisComponentOption,
  YAXisComponentOption,
} from 'echarts'

import { type Dataset } from '../../types'
import { AxisType, CartesianChartType } from '../types'
import {
  ConfigProps,
  yAxis,
  xAxis,
  AxisAlign,
  yAxisFormat,
  xAxisFormat,
} from './types'

import { Sort, getDataset } from '../common/getDataset'
import setDataZoom from './setDatazoom'
import setLegend from '../common/setLegend'
import setGrid from './serieUtils/setGrid'
import { transformXAxis, transformYAxis } from './transformAxis'
import transformCartesiansSeries from './transformSeries'
import { ColumnConfig, getColumns } from './getColumns'

export type AnimationEasing =
  | 'linear'
  | 'quadraticIn'
  | 'quadraticOut'
  | 'quadraticInOut'
  | 'cubicIn'
  | 'cubicOut'
  | 'cubicInOut'
  | 'quarticIn'
  | 'quarticOut'
  | 'quarticInOut'
  | 'quinticIn'
  | 'quinticOut'
  | 'quinticInOut'
  | 'sinusoidalIn'
  | 'sinusoidalOut'
  | 'sinusoidalInOut'
  | 'exponentialIn'
  | 'exponentialOut'
  | 'exponentialInOut'
  | 'circularIn'
  | 'circularOut'
  | 'circularInOut'
  | 'elasticIn'
  | 'elasticOut'
  | 'elasticInOut'
  | 'backIn'
  | 'backOut'
  | 'backInOut'
  | 'bounceIn'
  | 'bounceOut'
  | 'bounceInOut'

function swapAxisFn({
  swapAxis,
  xAxis,
  yAxis,
}: {
  swapAxis: boolean
  xAxis: XAXisComponentOption[]
  yAxis: YAXisComponentOption[]
}) {
  if (!swapAxis) return { xAxis, yAxis }

  const newXaxis = yAxis as unknown as XAXisComponentOption[]
  const newYaxis = xAxis as unknown as YAXisComponentOption[]

  return {
    xAxis: newXaxis,
    yAxis: newYaxis,
  }
}

function completeXAxis(axis: xAxisFormat) {
  return {
    ...X_FORMAT_DEFAULT,
    ...axis,
  }
}
function completeYAxis(axis: yAxisFormat) {
  return {
    ...Y_FORMAT_DEFAULT,
    ...axis,
  }
}

const CONIFG_DEFAULTS: ConfigProps = {
  showDots: true,
  showValues: false,
  showLegend: false,
  showZoom: false,
  showDecal: false,
  scatterConfig: { style: 'circle' },
  echartsConfig: {},
}
const BASE_FORMAT = {
  showAxis: true,
  showSplitLine: false,
  displayName: null,
  rotate: 0,
  showAxisTitle: true,
  axisAlign: AxisAlign.start,
}
const X_FORMAT_DEFAULT = {
  ...BASE_FORMAT,
  type: AxisType.category,
}
const Y_FORMAT_DEFAULT = {
  ...BASE_FORMAT,
  showSplitLine: true,
  stack: false,
  type: AxisType.value,
}

export type Props = {
  animation?: boolean
  animationEasing?: AnimationEasing
  animationEasingUpdate?: AnimationEasing
  dataset: Dataset
  x: ColumnConfig
  y: ColumnConfig
  sort?: Sort
  swapAxis?: boolean
  xTitle?: string
  yTitle?: string
  xFormat?: xAxis
  yFormat?: yAxis
  config?: ConfigProps
  // TODO: Implement when we implement legend click and zoom
  // Copy from old latitude
  hiddenSeries?: string[]
}
type CartesianProps = Props & {
  chartType?: CartesianChartType
}

// TODO: Pass theme object
export default function generateConfig({
  chartType = 'bar',
  animation = true,
  animationEasing = 'cubicInOut',
  animationEasingUpdate = 'cubicInOut',
  dataset,
  swapAxis = false,
  x,
  xTitle,
  y,
  yTitle,
  xFormat = X_FORMAT_DEFAULT,
  yFormat = Y_FORMAT_DEFAULT,
  sort,
  hiddenSeries = [],
  config = CONIFG_DEFAULTS,
}: CartesianProps): EChartsOption | null | undefined {
  const { showZoom = false, showLegend = false, showDecal = false } = config
  const yAxisList = Array.isArray(yFormat)
    ? yFormat.map(completeYAxis)
    : [completeYAxis(yFormat)]
  const xAxisList = Array.isArray(xFormat)
    ? xFormat.map(completeXAxis)
    : [completeXAxis(xFormat)]
  const normalizeValues = yAxisList[0]?.stack === 'normalized'

  const fields = dataset.fields
  const xColumns = getColumns({ column: x, chartType, fields })
  const yColumns = getColumns({ column: y, chartType, fields })
  const { datasets, datasetIndex } = getDataset({
    dataset,
    normalizeValues,
    sort,
  })
  const dataZoom = setDataZoom({ swapAxis, showZoom })
  const grid = setGrid({
    showLegend,
    showZoom,
    swapAxis,
  })

  const legend = setLegend({ show: showLegend, left: grid.left ?? 0 })
  const { series, axisMetadata } = transformCartesiansSeries({
    config,
    swapAxis,
    yAxis: yAxisList,
    xColumns,
    yColumns,
    dataset,
    hiddenSeries,
    datasetIndex,
  })

  const rawXAxis = transformXAxis({
    axisList: xAxisList,
    xColumns,
    yColumns,
    xTitle,
    swapAxis,
    dataset,
  })

  const rawYAxis = transformYAxis({
    axisList: yAxisList,
    swapAxis,
    yTitle,
    axisMetadata,
    dataset,
  })

  if (!rawXAxis || !rawYAxis) return null

  const { xAxis, yAxis } = swapAxisFn({
    xAxis: Array.isArray(rawXAxis) ? rawXAxis : [rawXAxis],
    yAxis: Array.isArray(rawYAxis) ? rawYAxis : [rawYAxis],
    swapAxis,
  })

  return {
    animation,
    animationEasing,
    animationEasingUpdate,
    dataset: datasets,
    xAxis,
    yAxis,
    series,
    dataZoom,
    aria: { enabled: showDecal, decal: { show: showDecal } },
    tooltip: {
      confine: false,
      order: 'valueDesc',
      trigger: 'axis',
      axisPointer: { type: 'cross' },
    },
    legend,
    grid,
  }
}
