import type { DatasetOption } from 'echarts/types/dist/shared'
import { DBSourceRow, Dataset } from '../../types'
import { AxisType } from '../types'

const STARTING_DATA_INDEX = 1

function calculateRowInPercentage(row: DBSourceRow) {
  const rowData = row.slice(STARTING_DATA_INDEX)
  const total = rowData.reduce(
    (sum, value) => Number(sum) + Number(value),
    0,
  ) as number

  if (total === 0) {
    return [row[0]].concat(rowData.map(() => 0))
  }

  return [row[0]].concat(rowData.map((value) => Number(value) / total))
}

type Value = string | number
type Props = {
  dataset: Dataset
  xColumnName: string
  xAxisType: AxisType
  usePercentage: boolean
}
function calculateDatasetSource({
  dataset,
  xColumnName,
  xAxisType,
  usePercentage,
}: Props) {
  const forceSort = xAxisType === AxisType.time
  const forceSortIndex = forceSort
    ? dataset.fields.findIndex((field) => field === xColumnName)
    : undefined

  // Sort manually by date if axis scale is Temporal
  const sortedDataset =
    forceSort && forceSortIndex !== undefined
      ? dataset.source.sort((a: Value[], b: Value[]) => {
        const aVal = a[forceSortIndex]
        const bVal = b[forceSortIndex]

        if (typeof aVal !== 'string' || typeof bVal !== 'string') return 0

        return new Date(aVal).getTime() - new Date(bVal).getTime()
      })
      : dataset.source

  if (!usePercentage) return sortedDataset

  // Use relative percentage instead of absolute values if usePercentage is true
  return sortedDataset.map(calculateRowInPercentage)
}

export function getDataset(props: Props): DatasetOption {
  return {
    sourceHeader: true,
    source: [props.dataset.fields].concat(
      calculateDatasetSource(props).map((row) => row.map(String)),
    ),
  }
}
