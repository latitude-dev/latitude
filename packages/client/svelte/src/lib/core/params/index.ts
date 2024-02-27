import { getParam, paramsStore } from '@latitude-sdk/client'
import { readable } from 'svelte/store'

export { setParam } from '@latitude-sdk/client'

/**
 * Creates a Svelte readable store for a specific query parameter.
 * This function allows you to reactively use the value of a query parameter within a Svelte component.
 * The store will automatically update whenever the corresponding query parameter changes.
 *
 * @param {string} name The name of the query parameter to be observed.
 * @returns A Svelte readable store initialized with the current value of the specified query parameter.
 *          Subscribes to changes in the specified query parameter and updates the store accordingly.
 *          Returns a function to unsubscribe from the query parameter changes when the store is no longer needed.
 */
export function useParam(name: string) {
  return readable(getParam(name), (set) => {
    const unsub = paramsStore.subscribe((state) => {
      set(state.params[name])
    })

    return () => {
      unsub()
    }
  })
}

/**
 * Creates a readable store that reflects the current state of parameters from `paramsStore`.
 * It synchronizes with updates to `paramsStore`, ensuring the subscriber always has the latest parameters.
 *
 * @returns A readable Svelte store that can be subscribed to for receiving updates of parameters.
 *
 * @example
 * // To use this function in a Svelte component:
 * import { useParams } from './path/to/params/index';
 *
 * // Inside a Svelte component script tag
 * const params = useParams();
 *
 * // To access the parameters
 * $: if ($params) console.log($params);
 */
export function useParams() {
  return readable(paramsStore.getState().params, (set) => {
    const unsub = paramsStore.subscribe((state) => {
      set(state.params)
    })

    return () => {
      unsub()
    }
  })
}
