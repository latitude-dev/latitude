import { cn } from '../../utils'

import * as scrollbar from './scrollbar'
export { scrollbar }

export function cssClass({ className }: { className?: string | null }) { 
  return cn("relative overflow-hidden", className)
}

export const VIEWPORT_CSS_CLASS = "h-full w-full max-h-[inherit] max-w-[inherit] rounded-[inherit]"