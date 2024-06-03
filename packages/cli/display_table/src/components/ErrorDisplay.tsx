import React, { useEffect, useState } from 'react'
import { CompileError } from '@latitude-data/sql-compiler'
import { Box, Text } from 'ink'

export default function Error({ error }: { error: Error }) {
  const [errorMsg, setErrorMsg] = useState(error.message)
  const [errorType, setErrorType] = useState('Error')
  useEffect(() => {
    if (error instanceof CompileError) {
      setErrorMsg(error.toString())
      setErrorType('CompileError')
      return
    }
    setErrorMsg(error.message)
    setErrorType('Error')
  }, [error])

  return (
    <Box
      flexDirection='column'
      flexGrow={1}
      overflowY='hidden'
      borderStyle='round'
      borderColor='red'
      padding={1}
    >
      <Text color='red' inverse bold>
        {' '}
        {errorType}{' '}
      </Text>
      <Text color='red'> {errorMsg} </Text>
    </Box>
  )
}
