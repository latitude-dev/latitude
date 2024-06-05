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

type ResponsiveValue<P extends Property> =
  | PropertyValue<P>
  | Partial<BreakpointObject<P>>
  | (PropertyValue<P> | null | undefined)[]

export default function resolveResponsiveValue<P extends Property>({
  property,
  value,
}: {
  property: P
  value: ResponsiveValue<P>
}): string[] {
  const prop = properties[property] as PropertyTypes[P]

  if (typeof value === 'string') {
    return [responsiveProp({ prop: prop[value], bp: 'mobile' })]
  } else if (typeof value === 'object' && !Array.isArray(value)) {
    return compact(
      BP_LIST.map((bp) => {
        const bpValue = value[bp]
        if (!bpValue) return null

        const classValue = prop[bpValue]

        if (!classValue) return null

        return responsiveProp({ prop: classValue, bp })
      }),
    )
  } else if (Array.isArray(value)) {
    return compact(
      value.map((item, index) => {
        if (item === null || item === undefined) return null

        const bp = BP_LIST[index]
        if (!bp) return null

        return responsiveProp({ prop: prop[item], bp })
      }),
    )
  } else {
    // Should never reach here
    return []
  }
}
