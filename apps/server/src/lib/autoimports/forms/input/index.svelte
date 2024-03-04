<script lang="ts">
  import { Input } from "@latitude-sdk/svelte";
  import { setViewParam, useViewParam } from "$lib/stores/viewParams";
  import { createEventDispatcher } from "svelte";

  export let name: string;
  export let value: unknown = "";

  let inputStore = useViewParam(name, value);

  const dispatch = createEventDispatcher();
  const handleInput = (event: Event) => {
    const newValue = (event.target as HTMLInputElement).value;
    setViewParam(name, newValue);

    dispatch("input", event);
  };
</script>

<Input on:input={handleInput} value={$inputStore} {...$$restProps} />