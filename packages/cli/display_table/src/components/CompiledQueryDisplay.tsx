import React from 'react'
import type {
  CompiledQuery,
  ResolvedParam,
} from '@latitude-data/source-manager'
import { Box, Text } from 'ink'
import Scrollable from './Scrollable.js'

export default function CompiledQueryDisplay({
  compiledQuery,
}: {
  compiledQuery: CompiledQuery
}) {
  function completeSql() {
    const fullComponents = []
    let restSql = compiledQuery.sql
    for (const param of compiledQuery.resolvedParams) {
      const [start, ...rest] = restSql.split(param.resolvedAs)
      fullComponents.push(<Text>{start}</Text>)
      fullComponents.push(
        <Text bold color='blue'>
          {param.resolvedAs}
        </Text>,
      )
      restSql = rest.join(param.resolvedAs)
    }
    fullComponents.push(<Text>{restSql}</Text>)
    return fullComponents
  }

  return (
    <Box
      flexDirection='row'
      flexGrow={1}
      overflowY='hidden'
      borderStyle='round'
      borderColor='blue'
      flexWrap='wrap'
    >
      <Scrollable flexGrow={5} autoFocus>
        <Text>{completeSql()}</Text>
      </Scrollable>
      {compiledQuery.resolvedParams.length ? (
        <Box
          flexDirection='column'
          flexGrow={1}
          flexShrink={0}
          minWidth={32}
          borderStyle='double'
          borderColor='blue'
          borderDimColor
          paddingLeft={1}
        >
          <Text bold color='blue' dimColor inverse>
            {' '}
            Parameterized values{' '}
          </Text>
          <Scrollable flexGrow={1} minWidth={32}>
            {compiledQuery.resolvedParams.map(
              (param: ResolvedParam, index: number) => (
                <Box key={index} flexDirection='row'>
                  <Text color='blue' bold>
                    {param.resolvedAs}
                  </Text>
                  <Text> {JSON.stringify(param.value)}</Text>
                </Box>
              ),
            )}
          </Scrollable>
        </Box>
      ) : null}
    </Box>
  )
}
