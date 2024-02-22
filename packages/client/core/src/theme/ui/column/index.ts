import { cn } from '../../utils'
import { Gap, gaps } from '../layout'

export function cssClass({ gap, grow }: { gap: Gap; grow: boolean }) {
  return cn('flex flex-col', gaps[gap], {
    'flex-grow': grow,
  })
}
