import { cn } from '../../utils'
import { Gap, gaps } from '../layout'

export type LayoutProps = {
  gap?: Gap
  grow?: boolean
  className?: string | null | undefined
}

export function cssClass({ gap = 4, grow = false, className }: LayoutProps) {
  return cn('flex flex-col', gaps[gap], className, {
    'flex-grow': grow,
  })
}
