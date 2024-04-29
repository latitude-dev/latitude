import { cn } from '../../utils'
import { colors, weights, FontWeight, TextColor } from '../tokens'

export const families = {
  sans: 'lat-font-sans',
  serif: 'lat-font-serif',
}

export const leadings = {
  h1: ' lat-leading-[3rem]',
  h2: ' lat-leading-10',
  h3: ' lat-leading-8',
  h4: ' lat-leading-6',
  h5: ' lat-leading-5',
  h6: ' lat-leading-4',
  none: 'lat-leading-none',
}

export const sizes = {
  h1: 'lat-text-4xl',
  h2: 'lat-text-2xl',
  h3: 'lat-text-xl',
  h4: 'lat-text-normal',
  h5: 'lat-text-sm',
  h6: 'lat-text-xs',
}

export const spacings = {
  normal: 'lat-tracking-normal',
  wide: 'lat-tracking-wide',
}
export const alignments = {
  left: 'lat-text-left',
  center: 'lat-text-center',
  right: 'lat-text-right',
}
export const wordBreaks = {
  normal: 'lat-break-normal',
  breakWord: 'lat-break-words',
  breakAll: 'lat-break-all',
}

export const whiteSpaces = {
  normal: 'lat-whitespace-normal',
  nowrap: 'lat-whitespace-nowrap',
  pre: 'lat-whitespace-pre',
  preLine: 'lat-whitespace-pre-line',
  preWrap: 'lat-whitespace-pre-wrap',
}

export type FontSize = keyof typeof sizes
export type LetterSpacing = keyof typeof spacings
export type TextAlign = keyof typeof alignments
export type WordBreak = keyof typeof wordBreaks
export type WhiteSpace = keyof typeof whiteSpaces
export type LineHeight = keyof typeof leadings
export type FontFamily = keyof typeof families

export type TextProps = {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  capitalize?: boolean
  class?: string | undefined | null
  centered?: boolean
  color?: TextColor
  ellipsis?: boolean
  lineThrough?: boolean
  noWrap?: boolean
  leading?: LineHeight
  size?: FontSize
  family?: FontFamily
  underline?: boolean
  uppercase?: boolean
  userSelect?: boolean
  spacing?: LetterSpacing
  weight?: FontWeight
  whiteSpace?: WhiteSpace
  wordBreak?: WordBreak
  align?: TextAlign
}

export type HeaderProps = Omit<TextProps, 'size' | 'leading' | 'as'>

export function cssClass({
  family = 'sans',
  capitalize = false,
  centered = false,
  class: className,
  size = 'h4',
  leading = 'h4',
  color = 'foreground',
  ellipsis = false,
  lineThrough = false,
  underline = false,
  uppercase = false,
  align = 'left',
  spacing = 'normal',
  weight = 'normal',
  whiteSpace = 'normal',
  wordBreak = 'normal',
}: TextProps) {
  const sizeClass = sizes[size]
  const leadingClass = leadings[leading]
  const colorClass = colors.textColors[color]
  const familyClass = families[family]
  const weightClass = weights[weight]
  const spacingClass = spacings[spacing]
  const alignClass = alignments[align]
  const wordBreakClass = wordBreaks[wordBreak]
  const whiteSpaceClass = whiteSpaces[whiteSpace]

  return cn(
    sizeClass,
    leadingClass,
    colorClass,
    familyClass,
    weightClass,
    spacingClass,
    alignClass,
    wordBreakClass,
    whiteSpaceClass,
    {
      'lat-uppercase': uppercase,
      'lat-capitalize': capitalize,
      'lat-underline': underline,
      'lat-line-through': lineThrough,
      'lat-text-center': centered,
      'lat-truncate': ellipsis,
    },
    className,
  )
}
