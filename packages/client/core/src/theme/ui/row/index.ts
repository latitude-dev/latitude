import { cn } from '../../utils'
import { LayoutProps } from '../column'

export function cssClass({ className }: LayoutProps) {
  return cn('flex flex-row', className)
}
