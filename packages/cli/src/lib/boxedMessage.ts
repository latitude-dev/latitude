import boxen from 'boxen'
import type { Options } from 'boxen'

type Props = {
  text: string
  title?: string
  color: 'green' | 'red' | 'yellow'
  options?: Options
}
export default function boxedMessage({
  text,
  title,
  color,
  options = {},
}: Props) {
  console.log(
    boxen(text, {
      ...options,
      title,
      titleAlignment: 'center',
      borderColor: color,
      padding: 3,
    }),
  )
}
