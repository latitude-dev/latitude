import { InlineParams } from '../hooks'
import { getAllViewParams } from '../../viewParams'

export function computeQueryParams(
  inlineParams: InlineParams
): Record<string, unknown> {
  const viewParams = getAllViewParams()
  const sanitizedViewParams = sanitizeParams(viewParams)
  const composedParams = composeParams(inlineParams, viewParams)

  return { ...sanitizedViewParams, ...composedParams }
}

export function sanitizeParams(
  params: Record<string, unknown>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined)
  )
}

export function composeParams(
  inlineParams: InlineParams,
  viewParams: Record<string, unknown>
): Record<string, unknown> {
  return Object.entries(inlineParams).reduce<Record<string, unknown>>(
    (accumulatedParams, [key, inlineParam]) => {
      const paramValue = resolveParamValue(inlineParam, viewParams)
      if (paramValue !== undefined) {
        accumulatedParams[key] = paramValue
      }
      return accumulatedParams
    },
    {}
  )
}

export function resolveParamValue(
  inlineParam: unknown,
  viewParams: Record<string, unknown>
): unknown {
  if (
    typeof inlineParam === 'object' &&
    inlineParam !== null &&
    'callback' in inlineParam
  ) {
    return (
      inlineParam as {
        callback: (viewParams: Record<string, unknown>) => string
      }
    ).callback(viewParams)
  }
  return inlineParam
}

export function createMiddlewareKey(
  queryPath: string,
  inlineParams: InlineParams = {}
): string {
  const hashedParams = Object.keys(inlineParams)
    .sort()
    .map(
      (paramName) =>
        `${paramName}=${
          inlineParams[paramName].key ?? String(inlineParams[paramName])
        }`
    )
    .join('&')
  return `query:${queryPath}?${hashedParams}`
}

function loadedKlass() {
  let _loaded = false

  return {
    get: () => _loaded,
    set: (value: boolean) => {
      _loaded = value
    },
  }
}

export const loaded = loadedKlass()
