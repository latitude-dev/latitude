import type { LegendComponentOption } from 'echarts'

export default function setLegend({
  show,
  left = 0,
}: {
  show: boolean
  left?: number | string
}): LegendComponentOption {
  return {
    type: 'scroll',
    show,
    align: 'left',
    left,
  }
}
