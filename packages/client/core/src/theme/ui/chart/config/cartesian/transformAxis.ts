import type { XAXisComponentOption, YAXisComponentOption } from 'echarts'
import { format } from 'date-fns/format'
import { compact } from 'lodash-es'

import { Dataset, ScaleDataValue } from '../../types'
import { COLORS, FONT, SPACES } from '../common/designTokens'
import { addCommas } from '../common/number'
import { AxisMetadata, findLongestValue } from './transformSeries'
import {
  AxisAlign,
  AxisOrientation,
  CommonAxisFormat,
  FullColumn,
  xAxisFormat,
  yAxisFormat,
} from './types'
import { AxisType } from '../types'
type Axis<O> = O extends 'y' ? YAXisComponentOption : XAXisComponentOption
const POSITIONS = {
  y: { start: 'left', end: 'right' },
  x: { start: 'bottom', end: 'top' },
}
const DEFAULT_TYPE: Partial<Record<AxisOrientation, AxisType>> = {
  x: AxisType.category,
  y: AxisType.value,
}

const CASCADING_TIME_FORMATS = {
  year: '{yyyy}',
  month: '{MMM}',
  day: '{ee} {d}',
  hour: '{HH}:{mm}',
  minute: '{HH}:{mm}',
  second: '{HH}:{mm}:{ss}',
  millisecond: '{hh}:{mm}:{ss} {SSS}',
  none: '{yyyy}-{MM}-{dd} {hh}:{mm}:{ss} {SSS}',
}

type LabelFormatterParams = {
  value: ScaleDataValue
}
const formatTimestamp = (params: LabelFormatterParams) => {
  return format(params.value as number, 'yyyy-MM-dd')
}

const AXIS_NAME_STYLES = {
  fontFamily: FONT.fontFamily.sans,
  color: COLORS.gray800,
  fontSize: FONT.sizes.h5.fontSize,
  lineHeight: FONT.sizes.h5.lineHeight,
  fontWeight: FONT.fontWeight.semibold,
}

const AXIS_LABEL_NAME_STYLES = {
  fontFamily: FONT.fontFamily.sans,
  color: COLORS.gray600,
  fontSize: FONT.sizes.h6.fontSize,
  lineHeight: FONT.sizes.h6.lineHeight,
  fontWeight: FONT.sizes.h6.fontWeight,
}

function getLongestDimensionLabel({
  dataset,
  serie,
}: {
  dataset: Dataset
  serie: FullColumn
}): string {
  const { fields, source } = dataset
  const column = serie.name
  const colIndex = fields.findIndex((field) => field === column)
  return findLongestValue(source, colIndex)
}

type TextObject = {
  text: string
  fontSize: number
}

/**
 * Dynamic width calculation of axis labels based on longest value
 * Not possible in Echarts by default. Issue here:
 * https://github.com/apache/echarts/issues/12415
 *
 * Copied from here:
 * https://github.com/lightdash/lightdash/pull/2730
 */
const calculateDimensionsText = (
  textObject: TextObject,
): {
  width: number
  height: number
} => {
  if (!textObject) return { width: 0, height: 0 }

  const doc = globalThis.document
  if (!doc) return { width: 0, height: 0 }

  const span = doc.createElement('span')
  doc.body.appendChild(span)

  span.style.height = 'auto'
  span.style.width = 'auto'
  span.style.font = AXIS_NAME_STYLES.fontFamily
  span.style.fontSize = `${textObject.fontSize}px`
  span.style.top = '0px'
  span.style.position = 'absolute'
  span.style.whiteSpace = 'no-wrap'
  span.innerHTML = textObject.text

  const width = Math.ceil(span.clientWidth)
  const height = Math.ceil(span.clientHeight)
  span.remove()

  return { width, height }
}

const AXIS_LABEL_MAX_WIDTH = 100
const PADDING_LABEL_TO_CHART = SPACES.s3
const PADDING_TITLE_TO_LABEL = SPACES.s4

function calculateNamedGap(
  axisLabel: TextObject,
  axisTitle: TextObject,
): number {
  const axisLabelSize = calculateDimensionsText(axisLabel)
  const axisTitleSize = calculateDimensionsText(axisTitle)
  const padding =
    PADDING_LABEL_TO_CHART + axisTitleSize.height + PADDING_TITLE_TO_LABEL

  if (axisLabelSize.width > AXIS_LABEL_MAX_WIDTH + padding) {
    return AXIS_LABEL_MAX_WIDTH + padding
  } else {
    return axisLabelSize.width + padding
  }
}

function getAxisName(
  axis: CommonAxisFormat,
  axisMetadata: AxisMetadata,
): string {
  const displayName = axis.displayName
  if (displayName && displayName.length > 0) {
    return displayName
  } else {
    return axisMetadata.seriesNames[0] || 'Default Axis Name'
  }
}

type AxisProps<O extends AxisOrientation> = {
  axis: O extends 'x' ? CommonAxisFormat : yAxisFormat
  show: boolean
  axisMetadata: AxisMetadata
  axisOrientation: O
  swapAxis: boolean
  nameGap: number
  showAxisPointerLabel: boolean
  boundaryGap: boolean | number
}
function buildAxis<O extends AxisOrientation>({
  axis,
  show,
  axisMetadata,
  nameGap,
  axisOrientation,
  swapAxis,
  showAxisPointerLabel,
  boundaryGap,
}: AxisProps<O>): Axis<O> {
  const dimensionAxis = swapAxis ? 'y' : 'x'
  const isDimension = axisOrientation === dimensionAxis
  const showLine = swapAxis ? !isDimension : isDimension
  const otherOrientation = axisOrientation === 'y' ? 'x' : 'y'
  const defaultType = DEFAULT_TYPE[axisOrientation]
  const defaultConfig = {
    show: true,
    position: axisOrientation === 'y' && !swapAxis ? 'left' : 'bottom',
    axisLabel: { show: true, rotate: 0 },
  } as Axis<O>

  const showAxisTitle = axis.showAxisTitle
  const axisAlign = axis.axisAlign ?? AxisAlign.start
  const seriesOrientation = swapAxis ? otherOrientation : axisOrientation
  const position = POSITIONS[seriesOrientation][axisAlign]
  const serieScale = axis.type || defaultType

  const axisName = getAxisName(axis, axisMetadata)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // "overflow" provoke this bug https://github.com/apache/echarts/issues/16833

  return {
    show,
    boundaryGap,
    type: serieScale as 'category',
    name: showAxisTitle ? axisName : null,
    nameLocation: 'center' as 'middle',
    nameRotate:
      axisAlign === 'end' && !isDimension ? -90 : isDimension ? 0 : 90,
    nameTextStyle: {
      ...AXIS_NAME_STYLES,
      verticalAlign: 'top',
      align: 'center',
    },
    nameGap: nameGap,
    position: position ?? defaultConfig.position,
    axisLine: {
      show: showLine,
      lineStyle: {
        color: COLORS.gray600,
      },
    },
    axisTick: { show: false },
    splitLine: {
      show: axis.showSplitLine,
      lineStyle: {
        color: COLORS.gray200,
      },
    },
    axisPointer: {
      label: {
        show: showAxisPointerLabel,
        formatter: serieScale === 'time' ? formatTimestamp : '{value}',
      },
    },
    axisLabel: {
      showMaxLabel: true,
      ...AXIS_LABEL_NAME_STYLES,
      show: !!axis.showAxis,
      rotate: axis.rotate || defaultConfig?.axisLabel?.rotate,
      formatter: serieScale === 'time' ? CASCADING_TIME_FORMATS : '{value}',
      width: AXIS_LABEL_MAX_WIDTH,
      overflow: 'truncate',
    },
  }
}

export function transformXAxis({
  dataset,
  axisList,
  xColumns,
  yColumns,
  swapAxis,
  xTitle,
}: {
  dataset: Dataset
  axisList: xAxisFormat[]
  xColumns: FullColumn[]
  yColumns: FullColumn[]
  swapAxis: boolean
  xTitle?: string
}): Axis<'x'> | null {
  const xAxis = axisList[0]
  const series = xColumns.filter((c) => c.axisIndex === 0)
  const ySeries = yColumns.filter((c) => c.axisIndex === 0)
  const allLines = ySeries.every(
    (serie) => serie.chartType === 'line' || serie.chartType === 'area',
  )
  const serie = series[0]
  const seriesNames = serie?.displayName || serie?.name

  if (!xAxis || !serie || !seriesNames) return null

  xAxis.displayName = xTitle

  let nameGap: number
  let longestWord = ''
  if (swapAxis) {
    if (xAxis.showAxis) {
      longestWord = getLongestDimensionLabel({
        dataset,
        serie,
      })
      nameGap = calculateNamedGap(
        { text: longestWord, fontSize: AXIS_LABEL_NAME_STYLES.fontSize },
        { text: seriesNames, fontSize: AXIS_NAME_STYLES.fontSize },
      )
    } else {
      nameGap = SPACES.s6
    }
  } else {
    if (xAxis.showAxis) {
      nameGap = SPACES.s8
    } else {
      nameGap = SPACES.s2
    }
  }

  return buildAxis({
    axisOrientation: 'x',
    boundaryGap: !allLines,
    axis: xAxis,
    show: series.length > 0,
    axisMetadata: {
      longestValue: longestWord,
      seriesNames: [seriesNames],
    },
    swapAxis,
    nameGap,
    showAxisPointerLabel: true,
  })
}

export function transformYAxis({
  axisList,
  swapAxis,
  axisMetadata,
  yTitle,
}: {
  axisList: yAxisFormat[]
  swapAxis: boolean
  axisMetadata: Record<string, AxisMetadata>
  dataset: Dataset
  yTitle?: string
}): Axis<'y'>[] {
  let nameGap: number
  return compact(
    axisList.map((axis, axisIndex) => {
      const metadata = axisMetadata[String(axisIndex)]

      if (!metadata) return null

      if (axisIndex === 0) {
        axis.displayName = yTitle
      }

      const title = axis.displayName ?? (metadata.seriesNames[0] || '')

      if (swapAxis) {
        if (axis.showAxis) {
          nameGap = SPACES.s7
        } else {
          nameGap = SPACES.s2
        }
      } else if (axisMetadata) {
        if (axis.showAxis && metadata) {
          nameGap = calculateNamedGap(
            {
              text: addCommas(metadata.longestValue),
              fontSize: AXIS_LABEL_NAME_STYLES.fontSize,
            },
            { text: title, fontSize: AXIS_NAME_STYLES.fontSize },
          )
        } else {
          nameGap = SPACES.s6
        }
      }

      return buildAxis({
        axisOrientation: 'y',
        boundaryGap: 0,
        axis,
        show: !!axis.showAxis,
        axisMetadata: metadata,
        swapAxis,
        nameGap,
        showAxisPointerLabel: false,
      })
    }),
  )
}
