<script lang="ts">
  import { Input } from "@latitude-data/svelte";
  import { setViewParam, useViewParam } from "$lib/stores/viewParams";
  import { createEventDispatcher } from "svelte";

  export let param: string;
  export let value: unknown = "";
  export let type: string = "text";

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

<Input
  on:input={handleInput}
  value={$inputStore}
  type={type}
  checked={type === "checkbox" && !!$inputStore}
  {...$$restProps}
/>