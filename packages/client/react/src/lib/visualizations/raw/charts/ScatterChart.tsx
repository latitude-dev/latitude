import Echart, {
  type Props as EchartProps,
} from '$src/lib/internal/shared/Echart'
import ChartWrapper, {
  type WrapperProps,
} from '$src/lib/internal/shared/ChartWrapper'
import {
  theme as client,
  type ScatterChartProps,
  type Dataset,
} from '@latitude-data/client'

const generate = client.ui.chart.generateScatterConfig
type Props = Omit<EchartProps, 'options' | 'isComputing'> &
  Omit<ScatterChartProps, 'dataset'> &
  WrapperProps

/* eslint-disable react/prop-types */
function ScatterChart({
  data,
  isLoading,
  error,
  x,
  y,
  title,
  description,
  bordered = false,
  width,
  height,
  locale = 'en',
  animation = true,
  sizeColumn,
  style = 'circle',
  swapAxis = false,
  xTitle = '',
  yTitle = '',
  xFormat,
  yFormat,
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
            x,
            y,
            sizeColumn,
            style,
            yTitle,
            xTitle,
            swapAxis,
            xFormat,
            yFormat,
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
export default ScatterChart
