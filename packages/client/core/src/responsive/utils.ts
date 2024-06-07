import { CSS_PREFIX } from '../constants'
import { type Breakpoint, breakpoints } from './breakpoints'

export function latCssPrefix(prop: string, sign: '-' | '' = '') {
  return sign === '-' ? `-${CSS_PREFIX}${prop}` : `${CSS_PREFIX}${prop}`
}

export function responsiveProp({
  prop,
  bp = 'mobile',
  generateNegative = false,
}: {
  prop: string
  bp?: Breakpoint
  generateNegative?: boolean
}) {
  const classNames = generateNegative
    ? [latCssPrefix(prop, '-'), latCssPrefix(prop)]
    : [latCssPrefix(prop)]

  return classNames.map((cn) =>
    bp === 'mobile' ? cn : `${breakpoints[bp]}:${cn}`,
  )
}
