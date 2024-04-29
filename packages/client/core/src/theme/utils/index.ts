import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const customTwMerge = extendTailwindMerge({
  prefix: 'lat-',
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}

export const isBrowser = typeof document !== 'undefined'
