import { GridOption } from 'echarts/types/dist/shared'
import { SPACES } from '../../common/designTokens'

const setGrid = ({
  showLegend,
  showZoom,
  swapAxis,
}: {
  showLegend: boolean
  showZoom: boolean
  swapAxis: boolean
}): GridOption => {
  return {
    containLabel: true,
    left: SPACES.s10,
    right: showZoom && swapAxis ? SPACES.s16 : SPACES.s2,
    top: showLegend ? SPACES.s14 : SPACES.s2,
    bottom: showZoom && !swapAxis ? SPACES.s20 : SPACES.s8,
  }
}

export default setGrid
