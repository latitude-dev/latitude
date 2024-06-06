import { cn } from '../../utils'
import { ColumnProps } from '../column'

// DEPRECATED: Use <Columns> component instead
export function cssClass({ className }: ColumnProps) {
  return cn('lat-flex lat-flex-row', className)
}
