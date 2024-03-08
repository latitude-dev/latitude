import { cn } from '../../utils'

export function cssClass({ className }: { className?: string | null }) {
  return cn("p-3", className)
}

import * as cell from './cell'
import * as day from './day'
import * as grid from './grid'
import * as gridBody from './grid-body'
import * as gridHead from './grid-head'
import * as gridRow from './grid-row'
import * as headCell from './head-cell'
import * as header from './header'
import * as heading from './heading'
import * as months from './months'
import * as nextButton from './next-button'
import * as prevButton from './prev-button'

export {
  cell,
  day,
  grid,
  gridBody,
  gridHead,
  gridRow,
  headCell,
  header,
  heading,
  months,
  nextButton,
  prevButton,
}