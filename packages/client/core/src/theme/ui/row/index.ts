import { cn } from '../../utils'
import { LayoutProps } from '../column'
import { gaps } from '../layout'

export function cssClass({ gap = 4, grow = false, className }: LayoutProps) {
  return cn('flex flex-row', gaps[gap], className, {
    'flex-grow': grow,
  })
}
