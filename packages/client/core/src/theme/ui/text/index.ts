import { cn } from '../../utils'

const colors = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  destructive: 'text-destructive',
  accent: 'text-accent',
  background: 'text-background',
  foreground: 'text-foreground',
  link: 'text-link',
  inherit: 'text-inherit',
}

const sizes = {
  h8: 'text-[8px] leading-[10px]', // 8px/10px
  h7: 'text-[10px] leading-4', // 10px/16px
  h6: 'text-xs leading-4', // 12px/16px
  h5: 'text-sm leading-5', // 14px/20px
  h4: 'text-normal leading-6', // 16px/24px
  h3: 'text-xl leading-8', // 20px/32px
  h2: 'text-h2 leading-10', // 26px/40px
  h1: 'text-4xl leading-h1 ', // 36px/48px
}

const families = {
  sans: 'font-sans',
  mono: 'font-mono',
}

const weights = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}
const spacings = {
  normal: 'tracking-normal',
  wide: 'tracking-wide',
}
const alignments = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}
const wordBreaks = {
  normal: 'break-normal',
  breakWord: 'break-words',
  breakAll: 'break-all',
}

const whiteSpaces = {
  normal: 'whitespace-normal',
  nowrap: 'whitespace-nowrap',
  pre: 'whitespace-pre',
  preLine: 'whitespace-pre-line',
  preWrap: 'whitespace-pre-wrap',
}

export type Color = keyof typeof colors
export type Size = keyof typeof sizes
export type Family = keyof typeof families
export type Weight = keyof typeof weights
export type Spacing = keyof typeof spacings
export type Align = keyof typeof alignments
export type WordBreak = keyof typeof wordBreaks
export type WhiteSpace = keyof typeof whiteSpaces

export function cssClass({
  family = 'sans',
  capitalize = false,
  centered = false,
  color = 'foreground',
  ellipsis = false,
  lineThrough = false,
  size,
  underline = false,
  uppercase = false,
  align = 'left',
  spacing = 'normal',
  weight = 'normal',
  whiteSpace = 'normal',
  wordBreak = 'normal',
}: {
  uppercase?: boolean
  capitalize?: boolean
  underline?: boolean
  lineThrough?: boolean
  centered?: boolean
  ellipsis?: boolean
  color?: Color
  size: Size
  family?: Family
  weight?: Weight
  spacing?: Spacing
  align?: Align
  wordBreak?: WordBreak
  whiteSpace?: WhiteSpace
}) {
  const colorClass = colors[color]
  const sizeClass = sizes[size]
  const familyClass = families[family]
  const weightClass = weights[weight]
  const spacingClass = spacings[spacing]
  const alignClass = alignments[align]
  const wordBreakClass = wordBreaks[wordBreak]
  const whiteSpaceClass = whiteSpaces[whiteSpace]

  return cn(
    colorClass,
    sizeClass,
    familyClass,
    weightClass,
    spacingClass,
    alignClass,
    wordBreakClass,
    whiteSpaceClass,
    {
      uppercase,
      capitalize,
      underline,
      'line-through': lineThrough,
      'text-center': centered,
      truncate: ellipsis,
    }
  )
}
