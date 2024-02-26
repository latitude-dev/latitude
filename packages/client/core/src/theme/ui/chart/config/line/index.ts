import { generateCartesianConfig } from '..'
import { type Props } from '../cartesian'

export default function generateLineChart(props: Props) {
  return generateCartesianConfig({ ...props, chartType: 'line' })
}
