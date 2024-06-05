import { flattenDeep } from 'lodash-es'
import { Properties } from '.'
import { type Breakpoint, breakpoints } from '../breakpoints'

const BP = Object.keys(breakpoints) as Breakpoint[]

function responsive({ prop, bp }: { prop: string; bp: Breakpoint }) {
  return bp === 'mobile' ? prop : `${breakpoints[bp]}:${prop}`
}

export default function generateClasses({
  properties,
}: {
  properties: Partial<Properties>
}) {
  return flattenDeep(
    Object.values(properties).map((props) =>
      Object.values(props).map((prop) =>
        BP.map((bp) => responsive({ prop, bp }))
      )
    ),
  ).join(' ')
}
