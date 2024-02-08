<script lang="ts">
  import BarChart from '$lib/Charts/BarChart.svelte';
  import Column from '$lib/Column.svelte';
  import Row from '$lib/Row.svelte';

  import '../index.css';
</script>

<Column gap={4}>
  <Row gap={4}>
    <Column>
      <div class="w-[900px] h-[500px]">
        <BarChart query="queryy" x="week_day" y="count" />
      </div>
    </Column>
  </Row>
</Column>
