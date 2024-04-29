import { cn } from '../../utils'
import { LayoutProps } from '../column'

export function cssClass({ className }: LayoutProps) {
  return cn('lat-flex lat-flex-row', className)
}
