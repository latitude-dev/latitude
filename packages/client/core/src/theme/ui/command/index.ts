import { cn } from '../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn(
    'lat-flex lat-h-full lat-w-full lat-flex-col lat-overflow-hidden lat-rounded-md lat-bg-popover lat-text-popover-foreground',
    className,
  )
}

import * as shortcut from './shortcut'
import * as separator from './separator'
import * as list from './list'
import * as item from './item'
import * as input from './input'
import * as group from './group'
import * as empty from './empty'
import * as dialog from './dialog'

export { shortcut, separator, list, item, input, group, empty, dialog }
