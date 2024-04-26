import { cn } from '../../utils'

export type LayoutProps = {
  className?: string | null | undefined
}

export function cssClass({ className }: LayoutProps) {
  return cn('lat-flex lat-flex-col', className)
}
