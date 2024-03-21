import QueryResult, { DataType } from '@latitude-data/query_result'

const data = new QueryResult({
  fields: [
    { name: 'event_month', type: DataType.String },
    { name: 'node_events_sum', type: DataType.Integer },
    { name: 'project_events_sum', type: DataType.Integer },
    { name: 'workspace_events_sum', type: DataType.Integer },
  ],
  rows: [
    ['2022-10', '3437', '3548', '200'],
    ['2022-11', '11240', '771', '60'],
    ['2022-12', '601', '323', '349'],
    ['2023-01', null, '323', '349'],
  ],
  rowCount: 33,
})

export default data
