import type { ECBasicOption } from 'echarts/types/dist/shared'
type EchartsOptions = ECBasicOption
type EchartsTheme = object
type Props = {
  options: EchartsOptions
  width: number
  height: number
  theme: EchartsTheme
  isComputing?: boolean
  locale?: string
}

type ChartableProps = {
  options: EchartsOptions
  theme: EchartsTheme
}

export { type Props, type ChartableProps }
