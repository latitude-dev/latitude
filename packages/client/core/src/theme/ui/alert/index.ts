import { cn } from '../../utils'
import { BackgroundColor, TextColor, colors } from '../tokens/colors'
import { useType } from './types'

export const ALERT_TYPES = {
  note: 'note',
  success: 'success',
  warning: 'warning',
  error: 'error',
  muted: 'muted',
}
export type AlertyType = keyof typeof ALERT_TYPES
export type AlertColor = {
  background: BackgroundColor
  foreground: TextColor
}

export type Props = {
  type: AlertyType
  scrollable?: boolean
  secondary?: boolean
  className?: string | null
}

export function cssClass({
  type,
  className,
  secondary = false,
  scrollable = false,
}: Props) {
  const { foreground, background } = useType({ type, secondary })
  const cssBgColor = colors.backgrounds[background]
  return {
    properties: { foreground },
    root: cn(
      'lat-flex lat-flex-row lat-justify-between ',
      ' lat-py-2.5 lat-px-4 lat-rounded-lg lat-gap-4',
      cssBgColor,
      className,
      {
        'lat-items-start lat-overflow-y-auto custom-scrollbar': scrollable,
        'lat-items-center': !scrollable,
      },
    ),
  }
}
