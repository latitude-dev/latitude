<script lang="ts">
  import { Column, Row } from '@latitude-sdk/svelte'
  import PieChart from '$lib/autoimports/chart/PieChart.svelte'
  import LineChart from '$lib/autoimports/chart/LineChart.svelte'
  import AreaChart from '$lib/autoimports/chart/AreaChart.svelte'
  import BarChart from '$lib/autoimports/chart/BarChart.svelte'
  import MixedChart from '$lib/autoimports/chart/MixedChart.svelte'
  import FunnelChart from '$lib/autoimports/chart/FunnelChart.svelte'
  import ScatterChart from '$lib/autoimports/chart/ScatterChart.svelte'
</script>

<Row><br /><br /></Row>
<Row>
  <Column><PieChart query="user_roles" width={500} /></Column>
  <Column>
    <LineChart
      query="events_by_month"
      x="month"
      y="pivot_*"
      yTitle="Events by Type"
      xTitle="Months"
      width={800}
    />
  </Column>
</Row>
<Row>
  <Column>
    <AreaChart
      query="events_by_month"
      x="month"
      y="pivot_*"
      yTitle="Events by Type"
      xTitle="Months"
      width={800}
    />
  </Column>
  <Column>
    <BarChart
      query="events_by_month"
      x="month"
      y="pivot_*"
      yTitle="Events by Type"
      xTitle="Months"
      width={800}
    />
  </Column>
</Row>
<Row>
  <Column>
    <MixedChart
      query="events_by_month"
      x="month"
      y={[
        'pivot_*',
        { chartType: 'line', name: 'events_total', displayName: 'Holi' },
      ]}
      yTitle="Events by Type"
      xTitle="Months"
      width={800}
    />
  </Column>
  <Column>
    <FunnelChart query="visits" width={800} />
  </Column>
</Row>
<Row>
  <Column>
    <ScatterChart
      query="scatter"
      x="x_column"
      y="y_column"
      sizeColumn="size_column"
      yTitle="Users"
      xTitle="Months"
      width={800}
    />
  </Column>
</Row>
