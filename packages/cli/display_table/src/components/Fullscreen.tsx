import React, { useEffect, useState, Component, ErrorInfo } from 'react'
import { Box, Text, useApp, useInput, useStdout } from 'ink'

const ENTER_ALT_SCREEN_COMMAND = '\x1b[?1049h'
const EXIT_ALT_SCREEN_COMMAND = '\x1b[?1049l'

process.stdout.write(ENTER_ALT_SCREEN_COMMAND)
process.on('exit', () => {
  process.stdout.write(EXIT_ALT_SCREEN_COMMAND)
})

type ErrorBoundaryState = {
  error?: Error
  errorInfo?: ErrorInfo
}
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.error) {
      return (
        <Box flexDirection='column' padding={1} height='100%'>
          <Box flexDirection='column' flexGrow={1} overflowY='hidden'>
            <Box>
              <Text color='red' inverse bold>
                {' '}
                ERROR{' '}
              </Text>
              <Text color='red'> {this.state.error?.message}</Text>
            </Box>
            <Text>{this.state.errorInfo?.digest}</Text>
            <Text dimColor>{this.state.errorInfo?.componentStack}</Text>
          </Box>
          <Text inverse> Esc / Ctrl+C / Q to exit </Text>
        </Box>
      )
    }

    return this.props.children
  }
}

export default function Fullscreen({
  children,
}: {
  children: React.ReactNode
}) {
  const { stdout } = useStdout()
  const { exit } = useApp()

  const [height, setHeight] = useState(stdout.rows)

  useEffect(() => {
    const handler = () => setHeight(stdout.rows)

    stdout.on('resize', handler)
    return () => {
      stdout.off('resize', handler)
    }
  }, [stdout])

  useInput((input, key) => {
    if (input === 'q' || key.escape || (key.ctrl && input === 'c')) {
      exit()
      process.exit(0)
    }
  })

  return (
    <Box flexDirection='column' height={height} flexGrow={1}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Box>
  )
}
