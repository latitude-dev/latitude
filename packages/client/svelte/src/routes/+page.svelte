<script lang="ts">
  import ThemeProvider from '$lib/ui/theme-wrapper'
  import { theme } from '@latitude-data/client'
  import { Button, Text } from '$lib'
  import { Table } from '$lib/internal'
  import QueryResult, { DataType } from '@latitude-data/query_result'

  const defaultTheme = theme.skins.defaultTheme
</script>

<ThemeProvider theme={defaultTheme} />

<Text.H1>Header 1</Text.H1>
<Text.H2>Header 2</Text.H2>
<Text.H3>Header 3</Text.H3>
<Text.H4>Header 4</Text.H4>
<Text.H5>Header 5</Text.H5>
<Text.H6>Header 6</Text.H6>

<Button>Button</Button>

<Table
  data={new QueryResult({
    rows: [[1]],
    fields: [{ name: 'id', type: DataType.Integer }],
    rowCount: 1,
  })}
/>
