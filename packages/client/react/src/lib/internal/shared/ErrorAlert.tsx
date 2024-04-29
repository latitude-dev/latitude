import { Alert } from '$src/lib/ui'
import { theme } from '@latitude-data/client'

export default function ErrorAlert({ error }: { error: Error }) {
  return (
    <div className={theme.ui.chart.ERROR_CLASS.wrapper}>
      <Alert type='error' scrollable secondary>
        {error.message}
      </Alert>
    </div>
  )
}
