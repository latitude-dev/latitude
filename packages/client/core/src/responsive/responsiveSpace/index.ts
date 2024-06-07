import { Space } from '$src/responsive/space'
import { type Breakpoint } from '../breakpoints'

type BreakpointSpace = {
  [K in Breakpoint]?: Space
}

type ResponsiveSpaceArray = ReadonlyArray<Space | null | undefined> & {
  0: Space
} & { length: 1 | 2 | 3 | 4 }

export type ResponsiveSpace =
  | Space
  | Partial<BreakpointSpace>
  | ResponsiveSpaceArray

