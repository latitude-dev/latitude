import * as Sentry from '@sentry/node'

export default function initSentry() {
  const enabled = process.env.CLI_SENTRY_ENABLED
  const dsn = process.env.CLI_SENTRY_DSN

  const isEnabled = dsn && enabled === 'true'

  if (!isEnabled) return

  Sentry.init({
    dsn,
  })
}
