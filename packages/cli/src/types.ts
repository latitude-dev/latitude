type ErrorColor = 'red' | 'yellow'
export type OnErrorProps = {
  error?: Error
  message: string
  color?: ErrorColor
}
export type OnErrorFn = (_args: OnErrorProps) => void

export type CommonCLIArgs = {
  folder?: string
  debug?: boolean
  'simulate-pro'?: boolean
}
