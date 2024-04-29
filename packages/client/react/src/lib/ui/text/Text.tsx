import React from 'react'
import { theme, type TextProps } from '@latitude-data/client'

type Props = TextProps & React.HTMLAttributes<HTMLSpanElement>

function Text({
  align = 'left',
  as = 'span',
  capitalize = false,
  centered = false,
  color = 'foreground',
  ellipsis = false,
  leading = 'h4',
  lineThrough = false,
  size = 'h4',
  spacing = 'normal',
  underline = false,
  uppercase = false,
  weight = 'normal',
  whiteSpace = 'normal',
  wordBreak = 'normal',
  className,
  ...props
}: Props) {
  const Element = as
  return (
    <Element
      className={theme.ui.text.cssClass({
        align,
        capitalize,
        centered,
        color,
        ellipsis,
        lineThrough,
        spacing,
        size,
        leading,
        underline,
        uppercase,
        weight,
        whiteSpace,
        wordBreak,
        class: className,
      })}
      {...props}
    />
  )
}

export default Text
