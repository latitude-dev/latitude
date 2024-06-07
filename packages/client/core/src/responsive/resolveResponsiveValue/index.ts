import { compact } from 'lodash-es'
import { type Breakpoint, BP_LIST } from '../breakpoints'
import { type Property, properties, PropertyValue } from '../properties'
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

export default function resolveResponsiveValue<P extends Property>({
  property,
  value,
  generateNegative = false,
}: {
  property: P
  value: ResponsiveValue<P>
  generateNegative?: boolean
}): string[] {
  if (!value) return []

  const prop = properties[property] as PropertyTypes[P]

  if (typeof value === 'string') {
    return [
      responsiveProp({ prop: prop[value], bp: 'mobile', generateNegative }),
    ]
  } else if (typeof value === 'object' && !Array.isArray(value)) {
    return compact(
      BP_LIST.map((bp) => {
        const bpValue = (value as Partial<BreakpointObject<P>>)[bp]
        if (!bpValue) return null

        const classValue = prop[bpValue]

        if (!classValue) return null

        return responsiveProp({ prop: classValue, bp, generateNegative })
      }),
    )
  } else if (Array.isArray(value)) {
    return compact(
      (value as ResponsiveArray<P>).map((item, index) => {
        if (item === null || item === undefined) return null

        const bp = BP_LIST[index]
        if (!bp) return null

        return responsiveProp({ prop: prop[item], bp, generateNegative })
      }),
    )
  } else {
    // Should never reach here
    return []
  }
}
