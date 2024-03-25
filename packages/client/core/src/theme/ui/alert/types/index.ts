import { AlertyType, AlertColor } from '../index'

type Type = {
  normal: AlertColor
  secondary: AlertColor
}
const TYPES: Record<AlertyType, Type> = {
  muted: {
    normal: {
      background: 'muted',
      foreground: 'mutedForeground',
    },
    secondary: {
      background: 'mutedForeground',
      foreground: 'muted',
    },
  },
  note: {
    normal: {
      background: 'primary',
      foreground: 'white',
    },
    secondary: {
      background: 'primary20',
      foreground: 'primary',
    },
  },
  warning: {
    normal: {
      background: 'yellow50',
      foreground: 'yellow900',
    },
    secondary: {
      background: 'yellow50',
      foreground: 'yellow900',
    },
  },
  error: {
    normal: {
      background: 'yellow50',
      foreground: 'yellow900',
    },
    secondary: {
      background: 'destructive20',
      foreground: 'destructive',
    },
  },
  success: {
    normal: {
      background: 'green500',
      foreground: 'white',
    },
    secondary: {
      background: 'green100',
      foreground: 'green700',
    },
  },
}

export const useType = ({
  type,
  secondary = false,
}: {
    type: AlertyType
    secondary: boolean
  }): AlertColor => {
  const mode = secondary ? 'secondary' : 'normal'

  const typeConfig = TYPES[type]

  return typeConfig[mode] || typeConfig.normal
}
