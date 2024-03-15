<script lang="ts">
  import { Input, Label, Text } from "@latitude-data/svelte";
  import { setViewParam, useViewParam } from "$lib/stores/viewParams";
  import { createEventDispatcher } from "svelte";

  type $$Props = {
    param: string;
    type: string;
    value?: unknown;
    label?: string;
    description?: string;
  }

  export let param: $$Props["param"];
  export let type: $$Props["type"] = "text";
  export let value: $$Props["value"] = undefined;
  export let label: $$Props["label"] = undefined;
  export let description: $$Props["description"] = undefined;

  let inputStore = useViewParam(param, value);

  function castValue(value: unknown) {
    if (type === "checkbox") return value === "true"; // TODO: Add an actual checkbox component
    if (type === "number") return Number(value);

    return value;
  }

  const dispatch = createEventDispatcher();
  const handleInput = (event: Event) => {
    const newValue = (event.target as HTMLInputElement).value;
    setViewParam(param, castValue(castValue(newValue)));

    dispatch("input", event);
  };
</script>

<div class="grid w-full max-w-sm items-center gap-1.5">
  {#if label}
    <Label for={param}>{label}</Label>
  {/if}
  <Input
    on:input={handleInput}
    value={$inputStore}
    type={type}
    checked={type === "checkbox" && !!$inputStore}
    {...$$restProps}
  />
  {#if description}
    <Text size="h5" color='muted'>{description}</Text>
  {/if}
</div>