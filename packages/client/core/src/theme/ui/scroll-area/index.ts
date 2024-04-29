import { cn } from '../../utils'

import * as scrollbar from './scrollbar'
export { scrollbar }

export function cssClass({ className }: { className?: string | null }) {
  return cn('lat-relative lat-overflow-hidden', className)
}

export const VIEWPORT_CSS_CLASS =
  'lat-h-full lat-w-full lat-max-h-[inherit] lat-max-w-[inherit] lat-rounded-[inherit]'
