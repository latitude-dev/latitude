import { CLIConfig } from '$src/config'
import syncDependencies from './syncDependencies'
import syncDotenv from './syncDotenv'
import syncQueries from './syncQueries'
import syncViews from './syncViews'

export default function sync({
  config,
  watch = false,
}: {
  config: CLIConfig
  watch?: boolean
}) {
  return Promise.all([
    syncViews({ config, watch }),
    syncDotenv({ config, watch }),
    syncQueries({ config, watch }),
    syncDependencies({ config, watch }),
  ])
}
