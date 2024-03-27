import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'

export default function initSentry() {
  const enabled = process.env.CLI_SENTRY_ENABLED
  const dsn = process.env.CLI_SENTRY_DSN

  const isEnabled = dsn && enabled === 'true'

  if (!isEnabled) return

  Sentry.init({
    dsn,
    integrations: [nodeProfilingIntegration()],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  })
}
