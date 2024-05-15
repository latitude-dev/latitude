<script lang="ts">
  import { Combobox } from '@latitude-data/svelte'
  import { setViewParam, useViewParam } from '$lib/stores/viewParams'
  import { createEventDispatcher } from 'svelte'
  import { type QueryProps, useQuery } from '$lib/stores/queries'
  import { derived, readable } from 'svelte/store'
  import { type QueryResultState } from '@latitude-data/client'

  type ComboboxItem = {
    value: unknown
    label: string
    disabled?: boolean
  }
  type SelectOption = ComboboxItem | unknown

  type $$Props = {
    param: string
    value?: unknown // Default selected value for the input
    placeholder?: string
    label?: string
    description?: string
    options?: SelectOption[] // Manually defined options
    searchable?: boolean
    className?: string
    align?: 'start' | 'center' | 'end'

    // Adding a query is optional. If not provided, it will just show the child options.
    query?: string
    labels?: string // Name of the column to use as labels
    values?: string // Name of the column to use as values
  } & Omit<QueryProps, 'query'> // Removed "query" because it's optional here.

  export let param: $$Props['param']
  export let value: $$Props['value'] = undefined
  export let placeholder: $$Props['placeholder'] = undefined
  export let label: $$Props['label'] = undefined
  export let description: $$Props['description'] = undefined
  export let options: $$Props['options'] = []
  export let searchable: $$Props['searchable'] = false
  export let align: $$Props['align'] = 'start'
  let className: $$Props['className'] = undefined
  export { className as class }

  export let query: $$Props['query'] = undefined
  export let inlineParams: $$Props['inlineParams'] = {}
  export let opts: $$Props['opts'] = {}

  export let labels: $$Props['labels'] = undefined
  export let values: $$Props['values'] = undefined

  let inputStore = useViewParam(param, value)

  const result = query
    ? useQuery({ query, inlineParams, opts })
    : readable({ isLoading: false } as QueryResultState, () => {}) // This is a dummy store with no data, for when there's no query.

  const resultArray = derived(result, ($result) => {
    if ($result.error) console.error($result.error)
    return $result.data?.toArray() ?? []
  })

  $: findValuesKey = () => {
    if (values) return values // User-defined values key
    if (!$result.data) return undefined
    if ($result.data.fields.length === 0) {
      console.error('No fields found in query result.')
    }
    // If no user-defined values key is provided, look for a "value" column. Otherwise, use the first column.
    return (
      $result.data.fields.find((f) => f.name === 'value')?.name ??
      $result.data.fields[0]?.name
    )
  }
  $: findLabelsKey = () => {
    if (labels) return labels // User-defined labels key
    if (!$result.data) return undefined
    // If no user-defined labels key is provided, look for a "label" column. Otherwise, use the value column.
    return (
      $result.data.fields.find((f) => f.name === 'label')?.name ??
      findValuesKey()
    )
  }

  $: valuesKey = findValuesKey()
  $: labelsKey = findLabelsKey()
  $: userDefinedItems =
    options?.map((item) => {
      if (item && typeof item === 'object' && 'value' in item) {
        return {
          value: item['value'],
          label: 'label' in item ? item['label'] : String(item['value']),
          disabled: 'disabled' in item ? item['disabled'] : false,
        } as ComboboxItem
      }
      return {
        value: item,
        label: String(item),
        disabled: false,
      } as ComboboxItem
    }) ?? []
  $: resultItems = $resultArray.map((item) => ({
    value: item[valuesKey ?? 0],
    label: String(item[labelsKey ?? 0]),
  }))
  $: allItems = [...userDefinedItems, ...resultItems]

  const dispatch = createEventDispatcher()
  const onSelect = (selected: unknown) => {
    setViewParam(param, selected)
    dispatch('change', selected)
  }
</script>

<div class={$result.isLoading ? 'animate-pulse' : ''}>
  <Combobox
    items={allItems}
    value={$inputStore}
    {onSelect}
    searchBox={Boolean(searchable)}
    {label}
    {description}
    {placeholder}
    emptyMessage="No items found."
    class={className}
    {align}
  />
</div>
