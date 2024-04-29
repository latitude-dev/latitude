import React, { useMemo } from 'react'
import { cn } from '$src/lib/utils'
import type QueryResult from '@latitude-data/query_result'

interface Props {
  loading: boolean
  error: Error | null | undefined
  data: QueryResult | null | undefined
  height?: number | string
  children?: React.ReactNode
}

export default function BlankSlate({
  loading,
  error,
  data,
  height,
  children,
}: Props) {
  const classes = useMemo(
    () =>
      cn('lat-relative lat-h-full lat-w-full', {
        'lat-animate-pulse': loading,
      }),
    [loading],
  )

  return (
    <div className={classes}>
      {!data && loading ? (
        <div
          className='lat-flex lat-w-full lat-flex-col lat-gap-4 lat-overflow-hidden'
          style={{ maxHeight: height }}
        >
          <div className='lat-grid lat-grid-cols-4 lat-gap-4 lat-rounded-lg lat-bg-muted lat-p-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className='lat-animate-gradient lat-h-4 lat-rounded-full lat-bg-gradient-to-r lat-from-muted lat-via-white lat-to-muted'
              />
            ))}
          </div>
          <div className='lat-grid lat-grid-cols-4 lat-gap-4'>
            {Array.from({ length: 120 }).map((_, i) => (
              <div
                key={i}
                className='lat-animate-gradient lat-h-4 lat-rounded-full lat-bg-gradient-to-r lat-from-muted lat-via-white lat-to-muted'
              />
            ))}
          </div>
        </div>
      ) : error ? (
        <div>error: {error.message}</div>
      ) : (
        children
      )}
    </div>
  )
}
