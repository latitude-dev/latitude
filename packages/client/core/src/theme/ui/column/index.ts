import { cn } from '../../utils'

export type LayoutProps = {
  className?: string | null | undefined
}

export function cssClass({ className }: LayoutProps) {
  return cn('flex flex-col', className)
}
