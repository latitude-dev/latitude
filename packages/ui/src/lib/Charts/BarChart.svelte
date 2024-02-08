<script lang="ts">
  import Chart, { buildOptions } from './Chart.svelte';
  import latitude from '../latitude.ts';
  import { browser } from '$app/environment';
  import type { EChartsOptions } from './props';
  import { onMount } from 'svelte';

  export let query: string;
  export let x: string;
  export let y: string;
  export let title: string | undefined = undefined;

  let options: EChartsOptions;
  let clientOptions: EChartsOptions;

  if (!browser) {
    const data = latitude.cache(query); // prefetch from cache if available
    if (data) {
      options = buildOptions({ data, title, x, y, type: 'bar' });
    }
  }

  onMount(async () => {
    const data = await latitude.query(query);
    clientOptions = buildOptions({ data, title, x, y, type: 'bar' });

    console.log(clientOptions);
  });
</script>

{#if clientOptions}
  <Chart options={clientOptions} />
{:else}
  <Chart {options} />
{/if}
