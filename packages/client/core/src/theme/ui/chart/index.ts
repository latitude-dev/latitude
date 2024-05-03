export * from './config'
export * as wrapper from './wrapper'

import type { Dataset, DBSource } from './types'
export type { Dataset, DBSource }

export function blankSlateCssRoot(_: { loading: boolean }) {
  return 'lat-relative lat-h-full lat-w-full lat-px-4'
}

export function blankSlateCssContent() {
  return 'lat-overflow-hidden animate-gradient lat-absolute lat-left-0 lat-right-0 lat-bottom-0 lat-max-h-full lat-w-full lat-bg-gradient-to-r from-transparent via-white to-transparent'
}

export const ERROR_CLASS = {
  wrapper: 'lat-w-full lat-h-full lat-flex lat-justify-center lat-items-center',
}
