<script lang="ts">
  import { Input } from "@latitude-data/svelte";
  import { setViewParam, useViewParam } from "$lib/stores/viewParams";
  import { createEventDispatcher } from "svelte";

  export let param: string;
  export let value: unknown = "";

  let inputStore = useViewParam(param, value);

  const dispatch = createEventDispatcher();
  const handleInput = (event: Event) => {
    const newValue = (event.target as HTMLInputElement).value;
    setViewParam(param, newValue);

    dispatch("input", event);
  };
</script>

<Input on:input={handleInput} value={$inputStore} {...$$restProps} />