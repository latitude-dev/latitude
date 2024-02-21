import { SPACES } from '../common/designTokens'

export default function setDataZoom({
  showZoom = false,
  swapAxis = false,
}: {
  swapAxis?: boolean
  showZoom?: boolean
}) {
  if (!showZoom) return []

  const sliderDataZoom = {
    type: 'slider',
    show: true,
    top: swapAxis ? SPACES.s10 : 'auto',
    bottom: SPACES.s5,
    left: swapAxis ? 'auto' : SPACES.s16,
    right: swapAxis ? SPACES.s4 : SPACES.s16,
  }

  return [
    {
      ...sliderDataZoom,
      ...(swapAxis ? { xAxisIndex: [0] } : { yAxisIndex: [0] }),
    },
  ]
}
