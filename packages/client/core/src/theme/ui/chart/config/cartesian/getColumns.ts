import { flatten } from 'lodash-es'

import { CartesianChartType } from '../types'
import { FullColumn, type Column } from './types'
export type ColumnConfig = string | Column | Column[] | (string | Column)[]

function isWildcard(column: string) {
  return column.includes('*')
}

function buildColumnString(column: string, chartType: CartesianChartType) {
  return {
    name: column,
    chartType,
    axisIndex: 0,
    displayName: column,
  }
}

function buildColumnObject(column: Column, chartType: CartesianChartType) {
  return {
    ...column,
    chartType: column?.chartType ?? chartType,
    displayName: column?.displayName ?? column.name,
    axisIndex: column?.axisIndex ?? 0,
  }
}

function filterByWildcard(fields: string[], column: string) {
  const isStart = column.startsWith('*')
  const name = column.replace('*', '')
  return fields.filter((field) =>
    isStart ? field.endsWith(name) : field.startsWith(name)
  )
}

function completeStringColumn({
  column,
  chartType,
  fields,
}: {
  column: string
  chartType: CartesianChartType
  fields: string[]
}): FullColumn | FullColumn[] {
  if (!isWildcard(column)) return buildColumnString(column, chartType)

  return filterByWildcard(fields, column).map((c) =>
    buildColumnString(c, chartType)
  )
}

function completeColumn({
  column,
  chartType,
  fields,
}: {
  column: Column | string
  chartType: CartesianChartType
  fields: string[]
}): FullColumn | FullColumn[] {
  if (typeof column === 'string') {
    return completeStringColumn({ column, chartType, fields })
  }
  if (!isWildcard(column.name)) return buildColumnObject(column, chartType)

  return filterByWildcard(fields, column.name).map((name) => {
    return buildColumnObject({ ...column, name }, chartType)
  })
}

export function getColumns({
  column,
  chartType,
  fields,
}: {
  column: ColumnConfig
  chartType: CartesianChartType
  fields: string[]
}): FullColumn[] {
  if (Array.isArray(column)) {
    return flatten(
      column.map((c) => completeColumn({ column: c, chartType, fields }))
    )
  }

  if (typeof column === 'string') {
    return flatten([completeStringColumn({ column, chartType, fields })])
  }

  return flatten([completeColumn({ column, chartType, fields })])
}
