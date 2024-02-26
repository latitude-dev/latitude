import { create } from 'zustand'

type ParamsStore = {
  params: Record<string, unknown>
  setParam: (key: string, value: unknown) => void
}

/**
 * A global store for managing parameters, which are key-value pairs.
 */
export const paramsStore = create<ParamsStore>((set) => ({
  params: {},
  setParam: (key, value) =>
    set((state) => ({ params: { ...state.params, [key]: value } })),
}))

/**
 * Sets a parameter value.
 */
export function setParam(key: string, value: unknown) {
  paramsStore.getState().setParam(key, value)
}

/**
 * Retrieves a parameter value.
 */
export function getParam(name: string) {
  return paramsStore.getState().params[name]
}
