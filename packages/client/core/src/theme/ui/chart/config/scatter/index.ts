import generateCartesianConfig from '../cartesian'
import { type Props } from '../cartesian'
import { ScatterStyle } from '../cartesian/types'

export type ScatterChartProps = Omit<Props, 'config'> & {
  config: Omit<Props['config'], 'scatterConfig'>
  sizeColumn: string
  style: ScatterStyle
}
export default function generateScatterChart({
  sizeColumn,
  style,
  config,
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
