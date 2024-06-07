import { compact } from 'lodash-es'
import { flattenDeep } from 'lodash-es'
import { type Breakpoint, BP_LIST } from '../breakpoints'
import {
  type Property,
  properties,
  PropertyValue,
} from '../properties'
import { responsiveProp } from '../utils'

type PropertyTypes = {
  [P in Property]: Record<PropertyValue<P>, string>
}

type BreakpointObject<P extends Property> = {
  [K in Breakpoint]?: PropertyValue<P>
}

type ResponsiveArray<P extends Property> = ReadonlyArray<
  PropertyValue<P> | null | undefined
> & {
  0: PropertyValue<P>
} & { length: 1 | 2 | 3 | 4 }

export type ResponsiveValue<P extends Property> =
  | PropertyValue<P>
  | Partial<BreakpointObject<P>>
  | ResponsiveArray<P>
  | null
  | undefined

function compactAndFlatten<T>(array: T[][]): T[] {
  return compact(flattenDeep(array))
}

export default function resolveResponsiveValue<P extends Property>({
  property,
  value,
}: {
  property: P
  value: ResponsiveValue<P>
}): string[] {
  if (!value) return []

  const prop = properties[property] as PropertyTypes[P]

  if (typeof value === 'string') {
    return responsiveProp({ prop: prop[value], bp: 'mobile' })
  } else if (typeof value === 'object' && !Array.isArray(value)) {
    return compactAndFlatten(
      BP_LIST.map((bp) => {
        const bpValue = (value as Partial<BreakpointObject<P>>)[bp]
        if (!bpValue) return []

        const classValue = prop[bpValue]

        if (!classValue) return []

        return responsiveProp({ prop: classValue, bp })
      }),
    )
  } else if (Array.isArray(value)) {
    return compactAndFlatten(
      (value as ResponsiveArray<P>).map((item, index) => {
        if (item === null || item === undefined) return []

        const bp = BP_LIST[index]
        if (!bp) return []

        return responsiveProp({ prop: prop[item], bp })
      }),
    )
  } else {
    // Should never reach here
    return []
  }
}
