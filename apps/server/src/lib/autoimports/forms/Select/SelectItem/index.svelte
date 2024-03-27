<script lang="ts">
  import { Select } from "@latitude-data/svelte";
  export let value: unknown;
</script>
<Select.Item {value} {...$$props} />
