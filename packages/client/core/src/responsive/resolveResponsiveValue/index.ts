import { compact } from 'lodash-es'
import { type Breakpoint, BP_LIST, breakpoints } from '../breakpoints'
import { type Property, properties, PropertyValue } from '../properties'

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
    return [prop[value]]
  } else if (typeof value === 'object' && !Array.isArray(value)) {
    return compact(
      BP_LIST.map((bp) => {
        const bpPrefix = breakpoints[bp]
        const bpValue = value[bp]
        if (!bpValue) return null

        const classValue = prop[bpValue]

        if (!classValue) return null

        return bp === 'mobile' ? classValue : `${bpPrefix}:${classValue}`
      }),
    )
  } else if (Array.isArray(value)) {
    return compact(
      value.map((item, index) => {
        if (item === null || item === undefined) return null

        const bpKey = BP_LIST[index]

        if (!bpKey) return null

        const bpPrefix = breakpoints[bpKey]
        const classValue = prop[item]

        return bpKey === 'mobile' ? classValue : `${bpPrefix}:${classValue}`
      }),
    )
  } else {
    // Should never reach here
    return []
  }
}
