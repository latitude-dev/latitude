import generateCartesianConfig from '../cartesian'

import { type Props } from '../cartesian'

export default function generateBarChart(props: Props) {
  return generateCartesianConfig({ ...props, chartType: 'bar' })
}
