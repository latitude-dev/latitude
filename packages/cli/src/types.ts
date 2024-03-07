type ErrorColor = 'red' | 'yellow'
export type OnErrorProps = { error: Error; message: string; color?: ErrorColor }
export type OnErrorFn = (_args: OnErrorProps) => void
