import { flattenDeep } from 'lodash-es'
import { Properties } from '.'
import { type Breakpoint, breakpoints, BP_LIST } from '../breakpoints'


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
        BP_LIST.map((bp) => responsive({ prop, bp }))
      )
    ),
  ).join(' ')
}
