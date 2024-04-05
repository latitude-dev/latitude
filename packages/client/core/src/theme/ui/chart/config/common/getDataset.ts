import { isNaN } from 'lodash-es'
import type { DatasetOption } from 'echarts/types/dist/shared'
import { DBSource, DBSourceColumn, DBSourceRow, Dataset } from '../../types'

function calculatePercentage(row: DBSourceRow) {
  const total = row.reduce((sum, value) => {
    const maybeNum = Number(value)
    if (isNaN(maybeNum)) return sum

    return Number(sum) + maybeNum
  }, 0) as number

  if (total === 0) {
    return row.map((val) => {
      const maybeNum = Number(val)
      if (isNaN(maybeNum)) return val
      return 0
    })
  }

  return row.map((value) => {
    const maybeNum = Number(value)
    if (isNaN(maybeNum)) return value

    return maybeNum / total
  })
}

type BaseSortItem = {
  order: 'asc' | 'desc'
  incomparable?: 'min' | 'max'
  parser?: 'time' | 'number' | 'trim'
}
type TransformedSort = BaseSortItem & { dimension: string }
type SortItem = BaseSortItem & { column: string }

export type Sort = string | SortItem | SortItem[]
type Props = {
  dataset: Dataset
  normalizeValues?: boolean
  sort?: Sort
}

function convertToNumberMaybe(item: DBSourceColumn) {
  return isNaN(Number(item)) ? item : Number(item)
}

function normalizeValues(source: DBSource, normalizeValues = false) {
  if (!normalizeValues)
    return source.map((row) => row.map(convertToNumberMaybe))

  return source.map(calculatePercentage)
}

function completeSortItem(sort: string | SortItem): TransformedSort {
  if (typeof sort === 'string') return { dimension: sort, order: 'asc' }

  return {
    dimension: sort.column,
    order: sort.order,
    parser: sort.parser,
    incomparable: sort.incomparable,
  }
}

function parseSort(sort: Sort | undefined): TransformedSort[] {
  if (!sort) return []
  if (Array.isArray(sort)) return sort.map(completeSortItem)

  return [completeSortItem(sort)]
}

export function getDataset(props: Props): {
  datasets: DatasetOption[]
  datasetIndex: number
} {
  const { fields, source } = props.dataset
  const sort = parseSort(props.sort)
  const dataset = {
    dimensions: fields,
    source: normalizeValues(source, props.normalizeValues),
  }

  if (!sort.length) return { datasets: [dataset], datasetIndex: 0 }

  const datasets = [dataset, { transform: { type: 'sort', config: sort } }]

  return {
    datasets,
    datasetIndex: datasets.length - 1,
  }
}
