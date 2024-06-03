import React, { useEffect } from 'react'
import { useStdout, measureElement } from 'ink'

export default function useResize(
  ref: React.MutableRefObject<any>,
  callback: ({ width, height }: { width: number; height: number }) => void,
) {
  const { stdout } = useStdout()

  useEffect(() => {
    if (!ref.current) return

    const resizeFn = () => {
      setTimeout(() => {
        const { width, height } = measureElement(ref.current)
        callback({ width, height })
      }, 10)
    }

    resizeFn()

    stdout.on('resize', resizeFn)
    return () => {
      stdout.off('resize', resizeFn)
    }
  }, [stdout, ref])
}
