import { writable, get, Writable, Readable, derived } from 'svelte/store'
import { browser } from '$app/environment'
import { replaceState } from '$app/navigation'
import { parse } from '@latitude-data/custom_types'
import { LatitudeApi } from '@latitude-data/client'

export type ViewParams = {
  [key: string]: unknown
}

const getParamsFromUrl = () => {
  if (!browser) return {}

  const urlParams = new URLSearchParams(globalThis?.location?.search)
  const newParams: ViewParams = {}
  urlParams.forEach((value, key) => {
    newParams[key] = parse(value)
  })
  return newParams
}

export function setUrlParam(newParams: ViewParams) {
  const cleanParams = Object.fromEntries(
    Object.entries(newParams).filter(
      ([_, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const newParamsString = LatitudeApi.buildParams(cleanParams)

  // There are two ways to update the url: the default window.location.replaceState and svelte's replaceState
  // When using the default window.location.replaceState, sveltekit will print a warning in the console recommending to use svelte's replaceState instead
  // When using svelte's replaceState, although it does change the url, it expects to only be ran within a svelte component, and will throw an error if not
  // To avoid the warning and the error, we use a try/catch block to catch the error and do nothing

  try {
    const urlParamsReplace = newParamsString ? `?${newParamsString}` : ''
    replaceState(urlParamsReplace, {})
  } catch (_) {
    /* do nothing */
  } // replaceState fails when not ran within a svelte component
}

const viewParamsStore = writable<ViewParams>(getParamsFromUrl())

export const useViewParams = (): Writable<ViewParams> => viewParamsStore
export const getAllViewParams = (): ViewParams => get(viewParamsStore)

export const useViewParam = (
  key: string,
  defaultValue?: unknown,
): Readable<unknown> => {
  if (!(key in get(viewParamsStore))) setViewParam(key, defaultValue)

  return derived(viewParamsStore, ($viewParams) =>
    key in $viewParams ? $viewParams[key] : defaultValue,
  )
}

export const getViewParam = (key: string, defaultValue?: unknown): unknown => {
  const params = get(viewParamsStore)
  return key in params ? params[key] : defaultValue
}

export const setViewParam = (key: string, value: unknown): void => {
  viewParamsStore.update((params) => {
    params[key] = value
    return params
  })
}

export const setViewParams = (params: ViewParams): void => {
  viewParamsStore.update((oldParams) => {
    return { ...oldParams, ...params }
  })
}
