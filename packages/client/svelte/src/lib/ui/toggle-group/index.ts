import { getContext, setContext } from 'svelte'
import Root from './toggle-group.svelte'
import Item from './toggle-group-item.svelte'
import { theme } from '@latitude-data/client'

export type ToggleVariants = theme.ui.toggle.VariantProps

export function setToggleGroupCtx(props: ToggleVariants) {
  setContext('toggleGroup', props)
}

export function getToggleGroupCtx() {
  return getContext<ToggleVariants>('toggleGroup')
}

export { Root, Item }
