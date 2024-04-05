import { Dataset, DBSource } from '../../types'
import { flatten, compact } from 'lodash-es'

import setSerie from './serieUtils/setSerie'
import { AxisAlign, ConfigProps, FullColumn, yAxisFormat } from './types'
import { ChartType } from './types'

function findLongest(list: string[]) {
  return list.reduce((longest: string, value: string) => {
    const longestLength = longest?.length || 0
    const valueLength = value?.length || 0

    if (longestLength > valueLength) return longest

    return value
  }, '')
}

export function findLongestValue(
  source: DBSource,
  sourceIndex: number,
): string {
  return findLongest(
    source
      .filter((row) => !!row[sourceIndex])
      .map((row) => String(row[sourceIndex])),
  )
}

export type AxisMetadata = {
  longestValue: string
  seriesNames: string[]
}
export default function transformCartesiansSeries({
  swapAxis,
  yAxis,
  xColumns,
  yColumns,
  dataset,
  hiddenSeries,
  config,
  datasetIndex,
}: {
  xColumns: FullColumn[]
  yColumns: FullColumn[]
  yAxis: yAxisFormat[]
  swapAxis: boolean
  dataset: Dataset
  hiddenSeries: string[]
  config: ConfigProps
  datasetIndex: number
}) {
  const fields = dataset.fields
  const dimension = xColumns[0]

  // At least 1 dimension serie to plot the chart
  if (!dimension) {
    return {
      series: [],
      axisMetadata: {},
    }
  }

  const { source } = dataset
  const axisMetadata: Record<number, AxisMetadata> = {}
  const series = flatten(
    yAxis.map((axis, axisIndex) => {
      const stackKey = axis.stack
        ? `${swapAxis ? 'axis_y' : 'axis_x'}_${
            axis.axisAlign ?? AxisAlign.start
          }`
        : null
      axisMetadata[axisIndex] = { longestValue: '', seriesNames: [] }
      const measurements = yColumns.filter(
        (column) => column.axisIndex === axisIndex,
      )
      return compact(
        measurements.map((measurement) => {
          const serieColumn = measurement.name
          const displayName = measurement.displayName
          const seriesName = displayName ? displayName : serieColumn
          const serieData = setSerie<ChartType>({
            fields,
            serieColumn,
            serieDisplayName: displayName,
            chartType: measurement.chartType,
            dimension,
            swapAxis,
            axisIndex,
            datasetIndex,
            source,
            config,
          })

          let serie = serieData.serie

          const isHidden = hiddenSeries.includes(seriesName)
          const longestValue = isHidden
            ? ''
            : findLongestValue(source, serieData.serieIndexInSource)

          if (stackKey) {
            serie = {
              ...serie,
              stack: stackKey,
            }
          }

          const meta = axisMetadata[axisIndex]

          if (!meta) return serie

          meta.longestValue = findLongest([meta.longestValue, longestValue])

          if (!isHidden) {
            meta.seriesNames.push(seriesName)
          }

          axisMetadata[axisIndex] = meta

          return serie
        }),
      )
    }),
  )

  return {
    series,
    axisMetadata,
  }
}
