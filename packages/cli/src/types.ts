type ErrorColor = 'red' | 'yellow'

export type OnErrorProps = {
  color?: ErrorColor
  error?: Error
  exit?: boolean
  message: string
}

export type OnErrorFn = (_args: OnErrorProps) => void

export type CommonCLIArgs = {
  folder?: string
  debug?: boolean
  'simulate-pro'?: boolean
}
