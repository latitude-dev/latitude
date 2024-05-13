export * from './config'
export * as wrapper from './wrapper'

import type { Dataset, DBSource } from './types'
export type { Dataset, DBSource }

export function blankSlateCssRoot(_: { loading: boolean }) {
  return 'lat-relative lat-h-full lat-w-full lat-px-4'
}

export function blankSlateCssContent() {
  return 'lat-overflow-hidden lat-animate-gradient lat-absolute lat-left-0 lat-right-0 lat-top-1/2 lat-transform -lat-translate-y-1/2 lat-max-h-full lat-w-full lat-bg-gradient-to-r lat-from-transparent lat-via-white lat-to-transparent'
}

export const ERROR_CLASS = {
  wrapper: 'lat-w-full lat-h-full lat-flex lat-justify-center lat-items-center',
}
