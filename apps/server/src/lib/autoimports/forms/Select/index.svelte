<script lang="ts">
  import { Select, Label, Text } from "@latitude-data/svelte";
  import { setViewParam, useViewParam } from "$lib/stores/viewParams";
  import { createEventDispatcher } from "svelte";
  import { type QueryProps, useQuery } from "$lib/stores/queries"
  import { derived, readable } from "svelte/store"
  import { type QueryResultState} from "@latitude-data/client"

  type $$Props = {
    param: string;
    value?: unknown; // Default selected value for the input
    placeholder?: string;
    label?: string;
    description?: string;

    // Adding a query is optional. If not provided, it will just show the child options.
    query?: string; 
    labels?: string; // Name of the column to use as labels
    values?: string; // Name of the column to use as values
  } & Omit<QueryProps, "query">; // Removed "query" because it's optional here.

  export let param: $$Props["param"];
  export let value: $$Props["value"] = undefined;
  export let placeholder: $$Props["placeholder"] = undefined;
  export let label: $$Props["label"] = undefined;
  export let description: $$Props["description"] = undefined;

  export let query: $$Props["query"] = undefined;
  export let inlineParams: $$Props['inlineParams'] = {}
  export let opts: $$Props['opts'] = {}

  export let labels: $$Props["labels"] = undefined;
  export let values: $$Props["values"] = undefined;

  let inputStore = useViewParam(param, value);

  const result = query
    ? useQuery({ query, inlineParams, opts })
    : readable({ isLoading: false } as QueryResultState, () => {}); // This is a dummy store with no data, for when there's no query.

  const resultArray = derived(result, ($result) => {
    if ($result.isLoading) return [];
    if ($result.error) {
      console.error($result.error);
      return [];
    }
    return $result.data?.toArray() ?? [];
  });

  $: labelsKey = labels ?? $result.data?.fields[0]?.name ?? "label";
  $: valuesKey = values ?? $result.data?.fields[0]?.name ?? "value";

  const dispatch = createEventDispatcher();
  const onSelect = (selected: Select.Selected<unknown> | undefined) => {
    if (!selected) return;
    setViewParam(param, selected.value);

    dispatch("change", selected.value);
  };
</script>

<div class="grid w-full max-w-sm items-center gap-1.5">
  {#if label}
    <Label for={param}>{label}</Label>
  {/if}
  <Select.Root
    selected={{ value: $inputStore }}
    onSelectedChange={onSelect}
  >
  <Select.Trigger>
    <Select.Value placeholder={$inputStore ? String($inputStore) : placeholder} />
  </Select.Trigger>
  <Select.Content>
    <!-- Harcodded options -->
    <slot />

    <!-- Dynamic options -->
    {#each $resultArray as item}
      <Select.Item value={item[valuesKey]}>{item[labelsKey]}</Select.Item>
    {/each}
  </Select.Content>
</Select.Root>
  {#if description}
    <Text size="h5" color='muted'>{description}</Text>
  {/if}
</div>