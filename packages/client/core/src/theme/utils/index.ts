import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

import type { ClassValue } from 'clsx'

const customTwMerge = extendTailwindMerge({
  prefix: 'lat-',
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}

export const isBrowser = typeof document !== 'undefined'
