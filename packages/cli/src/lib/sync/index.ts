import syncDependencies from './syncDependencies'
import syncDotenv from './syncDotenv'
import syncQueries from './syncQueries'
import syncViews from './syncViews'

export default function sync(
  { watch = false }: { watch?: boolean } = { watch: false },
) {
  return Promise.all([
    syncViews({ watch }),
    syncDotenv({ watch }),
    syncQueries({ watch }),
    syncDependencies({ watch }),
  ])
}
