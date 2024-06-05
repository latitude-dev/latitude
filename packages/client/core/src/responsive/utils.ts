import { CSS_PREFIX } from '../constants'
import { type Breakpoint, breakpoints } from './breakpoints'

export function responsiveProp({ prop, bp }: { prop: string; bp: Breakpoint }) {
  const className = `${CSS_PREFIX}${prop}`
  return bp === 'mobile' ? className : `${breakpoints[bp]}:${className}`
}
