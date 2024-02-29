import { writable, get, Writable } from 'svelte/store'
import { browser } from "$app/environment"
import { replaceState } from '$app/navigation'

export type ViewParams = {
  [key: string]: unknown
}

const viewParamsStore = writable<ViewParams>({})

export const updateViewParamsFromUrl = () => {
  if (!browser) return
  const urlParams = new URLSearchParams(globalThis.location.search)
  const newParams: ViewParams = {}
  urlParams.forEach((value, key) => {
    newParams[key] = value
  })
  viewParamsStore.set(newParams)
}

export const useViewParams = (): Writable<ViewParams> => viewParamsStore
export const getAllViewParams = (): ViewParams => get(viewParamsStore)

export const getViewParam = (key: string, defaultValue?: unknown): unknown => {
  const params = get(viewParamsStore)
  return key in params ? params[key] : defaultValue
}

export const setViewParam = (key: string, value: unknown): void => {
  if (browser) {
    const urlParams = new URLSearchParams(globalThis.location.search)
    urlParams.set(key, String(value))
    replaceState(`?${urlParams.toString()}`, {})
  }

  viewParamsStore.update((params) => {
    params[key] = value
    return params
  })
}