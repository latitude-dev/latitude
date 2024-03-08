import { cn } from '../../utils'

export const textColors = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  destructive: 'text-destructive',
  accent: 'text-accent',
  background: 'text-background',
  foreground: 'text-foreground',
  link: 'text-link',
  inherit: 'text-inherit',
}

export type TextColor = keyof typeof textColors

export const families = {
  sans: 'font-sans',
  serif: 'font-serif',
}

export const leadings = {
  h1: ' leading-[3rem]',
  h2: ' leading-10',
  h3: ' leading-8',
  h4: ' leading-6',
  h5: ' leading-5',
  h6: ' leading-4',
}

export const sizes = {
  h1: 'text-4xl',
  h2: 'text-2xl',
  h3: 'text-xl',
  h4: 'text-normal',
  h5: 'text-sm',
  h6: 'text-xs',
}

export const weights = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}
export const spacings = {
  normal: 'tracking-normal',
  wide: 'tracking-wide',
}
export const alignments = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}
export const wordBreaks = {
  normal: 'break-normal',
  breakWord: 'break-words',
  breakAll: 'break-all',
}

export const whiteSpaces = {
  normal: 'whitespace-normal',
  nowrap: 'whitespace-nowrap',
  pre: 'whitespace-pre',
  preLine: 'whitespace-pre-line',
  preWrap: 'whitespace-pre-wrap',
}

export type FontSize = keyof typeof sizes
export type FontWeight = keyof typeof weights
export type LetterSpacing = keyof typeof spacings
export type TextAlign = keyof typeof alignments
export type WordBreak = keyof typeof wordBreaks
export type WhiteSpace = keyof typeof whiteSpaces
export type LineHeight = keyof typeof leadings
export type FontFamily = keyof typeof families

export type TextProps = {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  capitalize?: boolean
  className?: string | undefined | null
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
  className,
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
  const colorClass = textColors[color]
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
      uppercase,
      capitalize,
      underline,
      'line-through': lineThrough,
      'text-center': centered,
      truncate: ellipsis,
    },
    className,
  )
}
