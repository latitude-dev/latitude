<script lang="ts">
  import Chart, { buildOptions } from './Chart.svelte';
  import latitude, { type IQueryResult } from '../latitude.ts';

  export let query: string;
  export let x: string;
  export let y: string;
  export let title: string | undefined = undefined;

  $: options = {};

  latitude.query(query).then((data: IQueryResult) => {
    options = buildOptions({ data, title, x, y, type: 'scatter' });
  });
</script>

<Chart {options} />
