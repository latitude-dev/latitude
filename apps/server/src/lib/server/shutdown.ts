import { clearAllConnectors } from './connectorManager'
let isListening = false

/**
 * This module provides mechanisms to gracefully shutdown of the server. A graceful shutdown ensures that the
 * server terminates its operations in an orderly manner, handling any necessary cleanup tasks before exiting.
 * Such tasks typically include closing open resources, such as database connections, and performing any other
 * required state cleanup to prevent data corruption or loss. This is crucial for maintaining data integrity and
 * system stability, especially in production environments.
 */
async function shutdown(): Promise<void> {
  await clearAllConnectors() // Manually close all open database connections
}

export default function configureShutdownHandler(): void {
  // Although this function should only be called once, we do not have actual control over
  // it. Therefore, we we add a guard to prevent multiple listeners from being attached.
  if (isListening) return
  isListening = true

  const gracefulShutdown = () => {
    shutdown()
      .then(() => {
        console.log('Server successfully shutdown.')
      })
      .catch((err) => {
        console.error('Error during shutdown:', err)
      })
      .finally(() => {
        process.exit(0)
      })
  }

  process.on('SIGINT', gracefulShutdown)
  process.on('SIGTERM', gracefulShutdown)
}
