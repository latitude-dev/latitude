import { isString } from 'lodash-es'

export function numericToNumber(val: unknown): number {
  const valFloat = parseFloat(val as string)
  return valFloat == val && // eslint-disable-line eqeqeq
    (valFloat !== 0 || !isString(val) || val.indexOf('x') <= 0) // For case ' 0x0 '.
    ? valFloat
    : NaN
}

export function isNumeric(val: unknown): val is number {
  return !isNaN(numericToNumber(val))
}

export function addCommas(x: string | number | bigint): string {
  if (!isNumeric(x)) {
    return isString(x) ? x : '-'
  }
  const number = Math.trunc(Number(x))
  const parts = (number + '').split('.')

  if (!parts[0]) return String(x)

  return (
    parts[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') +
    (parts.length > 1 ? '.' + parts[1] : '')
  )
}
