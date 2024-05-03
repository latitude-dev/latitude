import React, { useState, useEffect, useRef } from 'react'
import { Card } from '$src/lib'
import VisualizationHeader from './VisualizationHeader'
import BlankSlate from './ChartBlankSlate'
import ErrorAlert from './ErrorAlert'
import {
  theme,
  type Dataset,
  type QueryResultState,
} from '@latitude-data/client'

export type WrapperProps = QueryResultState & {
  bordered?: boolean
  title?: string
  description?: string
  height?: number
  width?: number
  download?: () => Promise<void>
  className?: string
  children: (props: {
    dataset: Dataset
    contentHeight?: number
  }) => React.ReactNode
}

export default function ChartWrapper({
  data,
  isLoading,
  error,
  bordered = false,
  title,
  description,
  height = 400,
  width,
  download,
  className,
  children,
}: WrapperProps) {
  const cardStyle = bordered ? 'normal' : 'invisible'

  const dataset = {
    fields: data?.fields ? data.fields.map((f) => f.name) : [],
    source: data?.rows ?? [],
  } as Dataset

  const cardHeader = useRef<HTMLDivElement>(null)
  const cardContent = useRef<HTMLDivElement>(null)

  const [headerHeight, setHeaderHeight] = useState(0)
  useEffect(() => {
    if (!cardHeader.current) return
    const cs = window.getComputedStyle(cardHeader.current)
    const paddingTop = parseFloat(cs.paddingTop)
    const paddingBottom = parseFloat(cs.paddingBottom)
    const newHeaderHeight =
      cardHeader.current.clientHeight + paddingTop + paddingBottom
    setHeaderHeight(newHeaderHeight)
  }, [cardHeader, setHeaderHeight])

  const [contentHeight, setContentHeight] = useState<number | undefined>(height)
  useEffect(() => {
    if (!cardContent.current) return
    const cs = window.getComputedStyle(cardContent.current)
    const paddingTop = parseFloat(cs.paddingTop)
    const paddingBottom = parseFloat(cs.paddingBottom)
    const padding = paddingTop + paddingBottom
    let newContentHeight = undefined
    if (height) {
      newContentHeight = height - headerHeight + (title ? padding : -padding)
    }
    setContentHeight(newContentHeight)
  }, [title, height, headerHeight, setContentHeight])

  return (
    <div
      className={theme.ui.chart.wrapper.cssClass({ isLoading, className })}
      style={{ width, height }}
    >
      <Card.Root
        className={theme.ui.chart.wrapper.CARD_CSS_CLASS}
        type={cardStyle}
      >
        <VisualizationHeader
          title={title}
          description={description}
          download={download}
          headerType={cardStyle}
          ref={cardHeader}
        />

        <Card.Content
          type={cardStyle}
          ref={cardContent}
          style={{ height: contentHeight }}
        >
          {error ? (
            <ErrorAlert error={error} />
          ) : !data || (!data && isLoading) ? (
            <BlankSlate isLoading={isLoading} />
          ) : (
            children({ dataset, contentHeight })
          )}
        </Card.Content>
      </Card.Root>
    </div>
  )
}
