import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, BoxProps, Text, useFocus, useFocusManager, useInput } from 'ink'
import type { BackgroundColorName, ForegroundColorName } from 'chalk'
import type { LiteralUnion } from 'type-fest'
import useResize from '../hooks/useResize.js'

type Color = LiteralUnion<ForegroundColorName, string>
type BgColor = LiteralUnion<BackgroundColorName, string>

type Props = BoxProps & {
  children: React.ReactNode
  scrollbarActiveChar?: string
  scrollbarInactiveChar?: string
  scrollbarColor?: Color
  scrolltrackColor?: BgColor
  scrollbarWidth?: number
  autoFocus?: boolean
}

export default function Scrollable({
  children,
  scrolltrackColor = 'gray',
  scrollbarColor = 'blue',
  scrollbarActiveChar = '█',
  scrollbarInactiveChar = '▓',
  scrollbarWidth = 1,
  autoFocus = false,
  ...rest
}: Props) {
  const [viewHeight, setViewHeight] = useState(0)
  const [viewWidth, setViewWidth] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const doesOverflow = useMemo(
    () => contentHeight > viewHeight,
    [contentHeight, viewHeight],
  )
  const heightRatio = useMemo(() => {
    if (viewHeight === 0) return 0
    if (contentHeight < viewHeight) return 1
    return viewHeight / contentHeight
  }, [viewHeight, contentHeight])

  const [offset, setOffset] = useState(0)

  const { isFocused } = useFocus({ autoFocus })
  const { focusNext, focusPrevious } = useFocusManager()

  const [scrollbarHeight, setScrollbarHeight] = useState(0)
  const [scrollbarOffset, setScrollbarOffset] = useState(0)

  const viewRef = useRef(null)
  const contentRef = useRef(null)
  useResize(viewRef, ({ width, height }) => {
    setViewWidth(width)
    setViewHeight(height)
  })
  useResize(contentRef, ({ height }) => {
    setContentHeight(height)
  })

  const scroll = useCallback(
    (amount: number) => {
      if (!doesOverflow) return setOffset(0)
      const newOffset = offset + amount
      if (newOffset < 0) return setOffset(0)
      if (newOffset + viewHeight > contentHeight)
        return setOffset(contentHeight - viewHeight)
      setOffset(newOffset)
    },
    [offset, viewHeight, contentHeight, doesOverflow],
  )

  useEffect(() => {
    scroll(0)
  }, [scroll])

  useInput((input, key) => {
    if (!isFocused) return
    if (input === 'j' || key.downArrow) scroll(1)
    if (input === 'k' || key.upArrow) scroll(-1)
    if (input === 'h' || key.leftArrow) focusPrevious()
    if (input === 'l' || key.rightArrow) focusNext()
  })

  useEffect(() => {
    setScrollbarHeight(Math.floor(viewHeight * heightRatio))
  }, [viewHeight, heightRatio])

  useEffect(() => {
    if (viewHeight + offset >= contentHeight)
      return setScrollbarOffset(Math.floor(viewHeight - scrollbarHeight))
    setScrollbarOffset(Math.floor(offset * heightRatio))
  }, [offset, heightRatio, viewHeight, contentHeight, scrollbarHeight])

  return (
    <Box position='relative' height='100%' {...rest}>
      <Box
        ref={viewRef}
        height='100%'
        flexGrow={1}
        flexDirection='row'
        overflow='hidden'
      >
        <Box
          ref={contentRef}
          position='absolute'
          width={doesOverflow ? viewWidth - scrollbarWidth : viewWidth}
          flexDirection='column'
          marginTop={-offset}
        >
          {children}
        </Box>
        {doesOverflow && (
          <Box
            position='absolute'
            marginLeft={viewWidth - scrollbarWidth}
            width={scrollbarWidth}
            height={viewHeight}
            flexDirection='column'
          >
            {Array.from({ length: viewHeight }, (_, index) => {
              const isScrollbar =
                index >= scrollbarOffset &&
                index < scrollbarOffset + scrollbarHeight
              const scrollbarChar = isScrollbar
                ? isFocused
                  ? scrollbarActiveChar
                  : scrollbarInactiveChar
                : ' '
              return (
                <Text
                  key={index}
                  backgroundColor={scrolltrackColor}
                  color={scrollbarColor}
                  dimColor={isScrollbar && !isFocused}
                >
                  {scrollbarChar.repeat(scrollbarWidth)}
                </Text>
              )
            })}
          </Box>
        )}
      </Box>
    </Box>
  )
}
