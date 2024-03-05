<script>
  import { Row, Column } from '@latitude-data/svelte'

  import Table from '../components/Table/index.svelte'
</script>

<Row>
  <Column class="w-1/2">
    <Table query="users" />
  </Column>
</Row>
