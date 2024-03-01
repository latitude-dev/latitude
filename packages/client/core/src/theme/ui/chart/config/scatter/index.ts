import generateCartesianConfig from '../cartesian'
import { type Props } from '../cartesian'
import { ScatterStyle } from '../cartesian/types'

export type ScatterChartProps = Omit<Props, 'config'> & {
  sizeColumn: string
  config?: Omit<Props['config'], 'scatterConfig'>
  style?: ScatterStyle
}

export default function generateScatterChart({
  sizeColumn,
  style = 'circle',
  config = {},
  ...rest
}: ScatterChartProps) {
  return generateCartesianConfig({
    ...rest,
    chartType: 'scatter',
    config: {
      ...config,
      scatterConfig: { column: sizeColumn, style },
    },
  })
}
