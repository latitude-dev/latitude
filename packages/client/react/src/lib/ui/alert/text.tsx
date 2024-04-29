import { Text } from '$src/lib'
import type { ExtendsUnion, FontWeight, TextColor } from '@latitude-data/client'
import * as React from 'react'

export type AlertFontWeight = ExtendsUnion<
  FontWeight,
  'normal' | 'medium' | 'bold'
>

type Props = React.HTMLAttributes<HTMLDivElement> & {
  fontWeight?: AlertFontWeight
  color: TextColor
  centered?: boolean
  children: React.ReactNode
}

function AlertText({
  fontWeight = 'normal',
  centered = true,
  color,
  children,
  ...props
}: Props) {
  const TextComponent = (() => {
    switch (fontWeight) {
      case 'medium':
        return Text.H5M
      case 'bold':
        return Text.H5B
      default:
        return Text.H5
    }
  })()

  return (
    <TextComponent color={color} centered={centered} {...props}>
      {children}
    </TextComponent>
  )
}

export default AlertText
