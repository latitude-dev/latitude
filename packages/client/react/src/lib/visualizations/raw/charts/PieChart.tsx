import Echart, {
  type Props as EchartProps,
} from '$src/lib/internal/shared/Echart'
import ChartWrapper, {
  type WrapperProps,
} from '$src/lib/internal/shared/ChartWrapper'
import {
  theme as client,
  type PieChartProps,
  type Dataset,
} from '@latitude-data/client'

const generate = client.ui.chart.generatePieConfig
type Props = Omit<EchartProps, 'options' | 'isComputing'> &
  Omit<PieChartProps, 'dataset'> &
  WrapperProps

/* eslint-disable react/prop-types */
function PieChartData({
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
  displayName,
  config,
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
            displayName,
            config,
          })}
          width={width}
          locale={locale}
        />
      )}
    </ChartWrapper>
  )
}

export { type Props }
export default PieChartData
