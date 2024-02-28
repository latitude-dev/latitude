import generateCartesianConfig from '../cartesian'
import { type Props } from '../cartesian'

export default function generateAreaChart(props: Props) {
  return generateCartesianConfig({ ...props, chartType: 'area' })
}
