import syncDotenv from './syncDotenv'
import syncQueries from './syncQueries'
import syncStaticFiles from './syncStaticFiles'
import syncViews from './syncViews'

export default function sync(
  { watch = false }: { watch?: boolean } = { watch: false },
) {
  return Promise.all([
    syncViews({ watch }),
    syncStaticFiles({ watch }),
    syncDotenv({ watch }),
    syncQueries({ watch }),
  ])
}
