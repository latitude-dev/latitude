import Echart, {
  type Props as EchartProps,
} from '$src/lib/internal/shared/Echart'
import ChartWrapper, {
  type WrapperProps,
} from '$src/lib/internal/shared/ChartWrapper'
import {
  theme as client,
  type FunnelChartProps,
  type Dataset,
} from '@latitude-data/client'

const generate = client.ui.chart.generateFunnelConfig
type Props = Omit<EchartProps, 'options' | 'isComputing'> &
  Omit<FunnelChartProps, 'dataset'> &
  WrapperProps

function FunnelChart({
  data,
  isLoading,
  error,
  title,
  description,
  bordered = false,
  sort,
  width,
  height,
  locale = 'en',
  animation = true,
  orientation = 'vertical',
  showColorGradient = false,
  showLabels = true,
  showDecal = false,
  showLegend = false,
  download,
}: Props) {
  return (
    <ChartWrapper
      download={download}
      data={data}
      isLoading={isLoading}
      error={error}
      width={width}
      height={height}
      title={title}
      description={description}
      bordered={bordered}
    >
      {({
        dataset,
        contentHeight,
      }: {
        dataset: Dataset
        contentHeight?: number
      }) => (
        <Echart
          height={contentHeight}
          options={generate({
            dataset,
            animation,
            sort,
            orientation,
            showColorGradient,
            showLabels,
            showDecal,
            showLegend,
          })}
          width={width}
          locale={locale}
        />
      )}
    </ChartWrapper>
  )
}

export { type Props }
export default FunnelChart
