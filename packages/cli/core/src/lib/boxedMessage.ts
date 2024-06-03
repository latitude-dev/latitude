import boxen from 'boxen'
import type { Options } from 'boxen'

type Props = {
  text: string
  title?: string
  textAlignment?: 'center' | 'left' | 'right'
  color: 'green' | 'red' | 'yellow'
  options?: Options
}
export default function boxedMessage({
  text,
  title,
  color,
  textAlignment = 'left',
  options = {},
}: Props) {
  console.log(
    boxen(text, {
      ...options,
      title,
      padding: 3,
      textAlignment,
      borderColor: color,
      titleAlignment: 'center',
    }),
  )
}
