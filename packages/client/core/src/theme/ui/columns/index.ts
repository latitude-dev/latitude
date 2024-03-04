import { cn } from '../../utils'
import { gaps, flexDirection, justifyContent, alignItems } from '../tokens'
import type { Gap, JustifyContent, AlignItems, FlexDirection } from '../tokens'

export type Props = {
  direction: FlexDirection
  space?: Gap
  align?: Omit<JustifyContent, 'between' | 'around'>
  alignY?: AlignItems
}
export function cssClass({ direction, space, align, alignY }: Props) {
  // Ignoring undefined is not an index because is fine using `cn` with undefined
  return cn(
    'flex',
    // @ts-ignore
    gaps[space],
    // @ts-ignore
    justifyContent[align],
    // @ts-ignore
    alignItems[alignY],
    flexDirection[direction],
  )
}
