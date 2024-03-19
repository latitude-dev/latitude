export * from './themes'
export * from './config'

import type { Dataset, DBSource } from './types'
export type { Dataset, DBSource }

export function blankSlateCssRoot(_: { loading: boolean }) {
  return 'relative h-full w-full px-4'
}

export function blankSlateCssContent() {
  return "overflow-hidden animate-gradient absolute left-0 right-0 bottom-0 max-h-full w-full bg-gradient-to-r from-transparent via-white to-transparent"
}

export const ERROR_CLASS = {
  wrapper: 'w-full h-full flex',
  content: 'h-full',
}
